const { reply, error } = require('../../functions/Util.js');

const solenolyrics = require('solenolyrics');
const Genius = require('genius-lyrics');
const queueData = require('../../data/queueData');
const geniusToken = process.env.GENIUS || require('../../config/config.json').genius_token;
const Client = geniusToken ? new Genius.Client(geniusToken) : undefined;
const { queue } = queueData;

const fetch = require('node-fetch');
const htmlToText = require('html-to-text');
const encoding = require('encoding');

const delim1 = '</div></div></div></div><div class="hwc"><div class="BNeawe tAd8D AP7Wnd"><div><div class="BNeawe tAd8D AP7Wnd">';
const delim2 = '</div></div></div></div></div><div><span class="hwc"><div class="BNeawe uEec3 AP7Wnd">';
const url = 'https://www.google.com/search?q=';

async function search(fullURL) {
    let i = await fetch(fullURL);
    i = await i.textConverted();
    [, i] = i.split(delim1);
    if (i) {
        // lyrics exists
        [i] = i.split(delim2);
        return i;
    }
    // no lyrics found
    return undefined;
}

async function lyricsFinder(artist = '', title = '') {
    const i = await search(`${url}${encodeURIComponent(title + ' ' + artist)}+lyrics`) ??
            await search(`${url}${encodeURIComponent(title + ' ' + artist)}+song+lyrics`) ??
            await search(`${url}${encodeURIComponent(title + ' ' + artist)}+song`) ??
            await search(`${url}${encodeURIComponent(title + ' ' + artist)}`) ?? '';

    const ret = i.split('\n');
    let final = '';
    for (let j = 0; j < ret.length; j += 1) {
        final = `${final}${htmlToText.fromString(ret[j])}\n`;
    }
    return String(encoding.convert(final)).trim();
}

async function lyric(command, args, language) {
    const serverQueue = queue.get(command.guild.id);
    async function searchLyrics(keyword) {
        const msg = await reply(command, language.searching.replace('${keyword}', keyword), 'BLUE');
        let lyrics = await lyricsFinder(' ', keyword).catch((err) => console.error(err));
        if (!lyrics) lyrics = await solenolyrics.requestLyricsFor(encodeURIComponent(keyword));
        if (!lyrics && Client !== undefined) {
            const searches = await Client.songs.search(keyword);
            if (searches) lyrics = await searches[0].lyrics().catch((err) => console.log(err));
        }
        if (!lyrics) {
            return msg.edit({
                embeds: [{
                    title: 'ERROR!',
                    description: language.noLyricsFound.replace('${keyword}', keyword),
                    color: 'RED',
                }],
            });
        }
        await msg.edit({
            embeds: [{
                title: language.title.replace('${keyword}', keyword),
                description: lyrics,
                color: 'YELLOW',
            }],
        });
    }

    if (serverQueue) {
        const songTitle = serverQueue.songs[0].title;
        const keyword = args[0] ? args[0] : songTitle;
        return await searchLyrics(keyword);
    }
    if (args[0]) return await searchLyrics(args[0]);
    return error(command, language.noKeyword);
}
module.exports = {
    name: 'lyric',
    guildOnly: true,
    aliases: ['ly'],
    description: {
        'en_US': 'Search for lyrics of a song!!',
        'zh_CN': '搜索歌词！',
        'zh_TW': '搜索歌詞！',
    },
    options: [
        {
            name: 'keyword',
            description: {
                'en_US': 'Song title, will use the title of the currently played song if no title given.',
                'zh_CN': '要搜索歌词的歌名，如果没有提供歌名将会搜索目前正在播放的歌曲的歌词',
                'zh_TW': '要搜索歌詞的歌名，如果沒有提供歌名將會搜索目前正在播放的歌曲的歌詞',
            },
            type: 'STRING',
        },
    ],
    async execute(message, args, language) {
        await lyric(message, [message.content.substring(message.content.indexOf(' ') + 1)], language);
    },
    slashCommand: {
        async execute(interaction, args, language) {
            await lyric(interaction, [interaction.options.getString('keyword')], language);
        },
    },
};
