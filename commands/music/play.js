const { reply, edit, error } = require('../../functions/Util.js');

const ytsr = require('youtube-sr').default;
const ytpl = require('ytpl');
const SpotifyClientID = process.env.SPOTIFY_CLIENT_ID || require('../../config/config.json').SpotifyClientID;
const SpotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET || require('../../config/config.json').SpotifyClientSecret;
const scdl = require('soundcloud-downloader').default;
const Spotify = require('../../functions/spotify');
let spotify;
if (SpotifyClientID && SpotifyClientSecret) spotify = new Spotify(SpotifyClientID, SpotifyClientSecret);
const { MessageActionRow, MessageSelectMenu, Message } = require('discord.js');

const { waitImport, handleVideo } = require('../../functions/musicFunctions');
const queueData = require('../../data/queueData');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { queue } = queueData;
const ytrx = /(?:youtube\.com.*[?|&](?:v|list)=|youtube\.com.*embed\/|youtube\.com.*v\/|youtu\.be\/)((?!videoseries)[a-zA-Z\d_-]*)/;
const scrxt = new RegExp('^(?<track>https://soundcloud.com/(?!sets|stats|groups|upload|you|mobile|stream|messages|discover|notifications|terms-of-use|people|pages|jobs|settings|logout|charts|imprint|popular[a-z\\d-_]{1,25})/(?!sets|playlist|stats|settings|logout|notifications|you|messages[a-z\\d-_]{1,100}(?:/s-[a-zA-Z\\d-_]{1,10})?))[a-z\\d-?=/]*$');
const sprxtrack = /(http[s]?:\/\/)?(open\.spotify\.com)\//;

async function play(command, args, language) {
    let serverQueue = queue.get(command.guild.id);
    if (!command.member.voice.channel) {
        return await error(command, language.notInVC);
    }

    const url = args[0];

    const voiceChannel = command.member.voice.channel;

    const permissions = voiceChannel.permissionsFor(command.client.user);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
        return error(command, language.cantJoinVC);
    }

    if (!serverQueue) {
        const queueConstruct = {
            textChannel: command.channel,
            voiceChannel,
            connection: null,
            songs: [],
            songHistory: [],
            volume: 5,
            playing: true,
            loop: false,
            loopQueue: false,
            player: undefined,
            resource: undefined,
            playMessage: undefined,
            filter: '',
        };
        queue.set(command.guild.id, queueConstruct);
        serverQueue = queue.get(command.guild.id);
    }

    async function processYoutubeLink(link) {
        if (!ytsr.validate(link, 'PLAYLIST_ID')) {
            const videos = await ytsr.getVideo(args[0]);
            return handleVideo([videos], voiceChannel, false, serverQueue, 'yt', command);
        }
        const playlist = await ytpl(link, { limit: Infinity });
        if (!playlist) return;
        const result = await waitImport(playlist.title, playlist.estimatedItemCount, command);
        if (result) {
            playlist.items.forEach((video) => handleVideo(video, voiceChannel, true, serverQueue, 'ytlist', command));
        }
    }

    async function processSpotifyLink(link) {
        link = `spotify:${link.replace(sprxtrack, '').replace('/', ':').replace('?.*', '')}`;
        const part = link.split(':');
        const Id = part[part.length - 1];
        let result;

        if (link.includes('track')) {
            result = await spotify.getTrack(Id);
            const videos = await ytsr.search(
                `${result.artists[0].name} ${result.name}`,
                { limit: 1, type: 'video' },
            );
            return await handleVideo(videos, voiceChannel, false, serverQueue, 'yt', command);
        }

        if (link.includes('album')) {
            result = await spotify.getAlbum(Id);
            const title = result.name;
            const m = await edit(command, language.importAlbum1.replace('${title}', title), 'BLUE');
            for (const i in result.tracks.items) {
                const videos = await ytsr.search(
                    `${result.artists[0].name} ${result.tracks.items[i].name}`,
                    { limit: 1, type: 'video' },
                );
                await handleVideo(videos, voiceChannel, true, serverQueue, 'yt', command);
                await m.edit(language.importAlbum2.replace('${videos[0].title}', videos[0].title).replace('${i}', i));
            }
            return m.edit(language.importAlbumDone.replace('${title}', title));
        }

        if (link.includes('playlist')) {
            result = await spotify.getPlaylist(Id);

            const title = result.name;
            const lenght = result.tracks.total;

            const wait = await waitImport(title, lenght, command);
            if (!wait) {
                const videos = await ytsr.search(
                    `${result.tracks.items[0].track.artists[0].name} ${result.tracks.items[0].track.name}`,
                    { limit: 1, type: 'video' },
                );
                return await handleVideo(videos, voiceChannel, false, serverQueue, 'yt', command);
            }

            const m = await edit(command, language.importPlaylist1.replace('${title}', title), 'BLUE');
            // eslint-disable-next-line no-constant-condition
            while (true) {
                for (const i in result.tracks.items) {
                    const videos = await ytsr.search(
                        `${result.tracks.items[i].track.artists[0].name} ${result.tracks.items[i].track.name}`,
                        { limit: 1, type: 'video' },
                    );
                    await handleVideo(videos, voiceChannel, true, serverQueue, 'yt', command);
                    await m.edit(language.importPlaylist2.replace('${videos[0].title}', videos[0].title).replace('${i}', i));
                }
                if (!result.tracks.next) {
                    break;
                } else {
                    result = await spotify.makeRequest(result.tracks.next);
                }
            }
            return m.edit(language.importPlaylistDone.replace('${title}', title));
        }
    }

    async function processSoundcloudLink(link) {
        if (scdl.isPlaylistURL(link)) {
            const data = await scdl.getSetInfo(link).catch((err) => {
                console.log(err);
                return edit(command, language.noResult, 'RED');
            });
            const wait = await waitImport(data.title, data.tracks.length, command);
            let m;
            if (wait) {
                m = await edit(command, language.importPlaylist1.replace('${data.title}', data.title), 'BLUE');
                for (const i in data.tracks) {
                    await handleVideo(data.tracks[i], voiceChannel, true, serverQueue, 'sc', command);
                    await m.edit(language.importPlaylist2.replace('${data.tracks[i].title}', data.tracks[i].title).replace('${i}', i));
                }
            }
            return m.edit(language.importPlaylistDone.replace('${data.title}', data.title));
        }
        if (link.match(scrxt)) {
            const data = await scdl.getInfo(link).catch((err) => {
                console.log(err);
                throw edit(command, language.noResult, 'RED');
            });
            await handleVideo(data, voiceChannel, true, serverQueue, 'sc', command);
        }
    }

    if (!args[0]) return error(command, language.noArgs);
    if (url.match(ytrx)) return processYoutubeLink(url);
    if (url.startsWith('https://open.spotify.com/')) {
        if (!SpotifyClientID || !SpotifyClientSecret) return error(command, 'Spotify songs cannot be processed!');
        return processSpotifyLink(url);
    }
    if (url.startsWith('https://soundcloud.com/')) return processSoundcloudLink(url);

    const keyword = command instanceof Message ? command.content.substring(command.content.indexOf(' ') + 1) : args[0];
    let msg = await reply(command, language.searching.replace('${keyword}', keyword), 'BLUE');
    const videos = await ytsr.search(keyword);
    const options = videos.map((video) => ({
        label: video.channel.name.length > 20 ? `${video.channel.name.slice(0, 20)}...` : video.channel.name,
        description: `${video.title.length > 35 ? `${video.title.slice(0, 30)}...` : video.title} - ${video.durationFormatted}`,
        value: (videos.indexOf(video)).toString(),
    }));

    const row = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId('select')
                .setPlaceholder('Nothing selected')
                .addOptions(options),
        );
    msg = await msg.edit({ content: language.choose, components: [row] });
    serverQueue.playMessage = msg;
    const filter = (interaction) => {
        return interaction.customId === 'select' && interaction.user.id === command.member.id;
    };
    const collector = msg.createMessageComponentCollector({ filter, time: 100000 });
    collector.on('collect', async (menu) => {
        await handleVideo([videos[menu.values[0]]], voiceChannel, false, serverQueue, 'yt', command);
    });
    collector.on('end', async (menu) => {
        if (!menu.first()) {
            msg.channel.send(language.timeout);
            await msg.delete();
        }
    });
}

module.exports = {
    name: 'play',
    guildOnly: true,
    aliases: ['p'],
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescriptionLocalizations({
            'en-US': 'Play a song based on a given url or a keyword',
            'zh-CN': '根据关键字或链接播放歌曲',
            'zh-TW': '根據關鍵字或鏈接播放歌曲',
        })
        .addStringOption((option) => option
            .setName('song')
            .setDescriptionLocalizations({
                'en-US': 'YouTube/SoundCloud/Spotify Link / keyword to search on YouTube',
                'zh-CN': 'YouTube/SoundCloud/Spotify链接/在YouTube上搜索的关键词',
                'zh-TW': 'YouTube/SoundCloud/Spotify鏈接/在YouTube上搜索的關鍵詞',
            }),
        ),
    async execute(interaction, language) {
        await interaction.deferReply();
        await play(interaction, [interaction.options.getString('song')], language);
    },
};
