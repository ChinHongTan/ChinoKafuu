const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const commandReply = new CommandReply();

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
        const msg = await commandReply.reply(command, `:mag: | Searching lyrics for ${keyword}...`, 'BLUE');
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
                    description: `:x: | No lyrics found for \`${keyword}\`!`,
                    color: 'RED',
                }],
            });
        }
        await msg.edit({
            embeds: [{
                title: `Lyric for \`${keyword}\``,
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
    return commandReply.reply(command, 'No keyword given!', 'RED');
}
module.exports = {
    name: 'lyric',
    guildOnly: true,
    aliases: ['ly'],
    description: true,
    async execute(message, args, language) {
        await lyric(message, [message.content.substr(message.content.indexOf(' ') + 1)], language);
    },
    slashCommand: {
        data: new SlashCommandBuilder()
            .addStringOption((option) => option.setName('keyword').setDescription('Song title to search for lyrics')),
        async execute(interaction, args, language) {
            await lyric(interaction, [interaction.options.getString('keyword')], language);
        },
    },
};
