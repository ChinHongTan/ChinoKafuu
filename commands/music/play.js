const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const commandReply = new CommandReply();
module.exports = {
    name: 'play',
    guildOnly: true,
    aliases: ['p'],
    description: true,
    async execute(message, args, language) {
        const ytsr = require('youtube-sr').default;
        const ytpl = require('ytpl');
        const scID = process.env.SCID || require('../../config/config.json').scID;
        const SpotifyClientID = process.env.SPOTIFY_CLIENT_ID || require('../../config/config.json').SpotifyClientID;
        const SpotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET || require('../../config/config.json').SpotifyClientSecret;
        const scdl = require('soundcloud-downloader').default;
        const Spotify = require('../../functions/spotify');
        const spotify = new Spotify(SpotifyClientID, SpotifyClientSecret);
        const { MessageActionRow, MessageSelectMenu } = require('discord.js');

        const { waitimport, handleVideo } = require('../../functions/musicFunctions');
        const ytrx = new RegExp('(?:youtube\\.com.*(?:\\?|&)(?:v|list)=|youtube\\.com.*embed\\/|youtube\\.com.*v\\/|youtu\\.be\\/)((?!videoseries)[a-zA-Z0-9_-]*)');
        const scrxt = new RegExp('^(?<track>https://soundcloud.com/(?:(?!sets|stats|groups|upload|you|mobile|stream|messages|discover|notifications|terms-of-use|people|pages|jobs|settings|logout|charts|imprint|popular)(?:[a-z0-9-_]{1,25}))/(?:(?:(?!sets|playlist|stats|settings|logout|notifications|you|messages)(?:[a-z0-9-_]{1,100}))(?:/s-[a-zA-Z0-9-_]{1,10})?))(?:[a-z0-9-?=/]*)$');
        const sprxtrack = new RegExp('(http[s]?://)?(open.spotify.com)/');

        const queueData = require('../../data/queueData');
        const { queue } = queueData;
        let serverQueue = queue.get(message.guild.id);
        const url = args[0];

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.channel.send(language.notInVC);
        }
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
            return message.channel.send(language.cantJoinVC);
        }

        if (!serverQueue) {
            const queueConstruct = {
                textChannel: message.channel,
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
                filter: '',
            };
            queue.set(message.guild.id, queueConstruct);
            serverQueue = queue.get(message.guild.id);
        }

        async function processYoutubeLink(link) {
            if (!ytsr.validate(link, 'PLAYLIST_ID')) {
                const videos = await ytsr.getVideo(args[0]);
                return handleVideo([videos], voiceChannel, false, serverQueue, 'yt', message);
            }
            const playlist = await ytpl(link, { limit: Infinity });
            if (!playlist) return;
            const result = await waitimport(playlist.title, playlist.estimatedItemCount, message);
            if (result) {
                playlist.items.forEach((video) => handleVideo(video, voiceChannel, true, serverQueue, 'ytlist', message));
            }
        }

        async function processSpotifyLink(link) {
            link = `spotify:${link.replace(sprxtrack, '').replace('/', ':').replace('?.*', '')}`;
            const part = link.split(':');
            const Id = part[part.length - 1];
            let result;

            if (link.includes('track')) {
                result = await spotify.gettrack(Id);
                const videos = await ytsr.search(
                    `${result.artists[0].name} ${result.name}`,
                    { limit: 1 },
                );
                return await handleVideo(videos, voiceChannel, false, serverQueue, 'yt', message);
            }

            if (link.includes('album')) {
                result = await spotify.getAlbum(Id);
                const title = result.name;
                const m = await message.channel.send(language.importAlbum1.replace('${title}', title));
                for (const i in result.tracks.items) {
                    const videos = await ytsr.search(
                        `${result.artists[0].name} ${result.tracks.items[i].name}`,
                        { limit: 1 },
                    );
                    await handleVideo(videos, voiceChannel, true, serverQueue, 'yt', message);
                    m.edit(language.importAlbum2.replace('${videos[0].title}', videos[0].title).replace('${i}', i));
                }
                return m.edit(language.importAlbumDone.replace('${title}', title));
            }

            if (link.includes('playlist')) {
                result = await spotify.getplaylist(Id);

                const title = result.name;
                const lenght = result.tracks.total;

                const wait = await waitimport(title, lenght, message);
                if (!wait) {
                    const videos = await ytsr.search(
                        `${result.tracks.items[0].track.artists[0].name} ${result.tracks.items[0].track.name}`,
                        { limit: 1 },
                    );
                    return await handleVideo(videos, voiceChannel, false, serverQueue, 'yt', message);
                }

                const m = await message.channel.send(language.importPlaylist1.replace('${title}', title));
                while (true) {
                    for (const i in result.tracks.items) {
                        const videos = await ytsr.search(
                            `${result.tracks.items[i].track.artists[0].name} ${result.tracks.items[i].track.name}`,
                            { limit: 1 },
                        );
                        await handleVideo(videos, voiceChannel, true, serverQueue, 'yt', message);
                        m.edit(language.importPlaylist2.replace('${videos[0].title}', videos[0].title).replace('${i}', i));
                    }
                    if (!result.tracks.next) {
                        break;
                    }
                    else {
                        result = await spotify._make_spotify_req(result.tracks.next);
                    }
                }
                return m.edit(language.importPlaylistDone.replace('${title}', title));
            }
        }

        async function processSoundcloudLink(link) {
            if (scdl.isPlaylistURL(link)) {
                const data = await scdl.getSetInfo(link, scID).catch((err) => {
                    console.log(err);
                    return message.channel.send(language.noResult);
                });
                const wait = await waitimport(data.title, data.tracks.length, message);
                let m;
                if (wait) {
                    m = await message.channel.send(language.importPlaylist1.replace('${data.title}', data.title));
                    for (const i in data.tracks) {
                        await handleVideo(data.tracks[i], voiceChannel, true, serverQueue, 'sc', message);
                        m.edit(language.importPlaylist2.replace('${data.tracks[i].title}', data.tracks[i].title).replace('${i}', i));
                    }
                }
                return m.edit(language.importPlaylistDone.replace('${data.title}', data.title));
            }
            if (link.match(scrxt)) {
                const data = await scdl.getInfo(link, scID).catch((err) => {
                    console.log(err);
                    throw message.channel.send(language.noResult);
                });
                await handleVideo(data, voiceChannel, true, serverQueue, 'sc', message);
            }
        }

        if (!args[0]) return message.channel.send(language.noArgs);
        if (url.match(ytrx)) return processYoutubeLink(url);
        if (url.includes('open.spotify.com')) return processSpotifyLink(url);
        if (url.includes('soundcloud.com')) return processSoundcloudLink(url);

        const keyword = message.content.substr(message.content.indexOf(' ') + 1);
        message.channel.send(language.searching.replace('${keyword}', keyword));
        const videos = await ytsr.search(keyword);
        const options = videos.map((video) => ({
            label: video.channel.name.length > 20 ? `${video.channel.name.slice(0, 20)}...` : video.channel.name,
            description: `${video.title.length > 35 ? `${video.title.slice(0, 30)}...` : video.title} - ${video.durationFormatted}`,
            value: (videos.indexOf(video) + 1).toString(),
        }));

        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('select')
                    .setPlaceholder('Nothing selected')
                    .addOptions(options),
            );
        const msg = await message.channel.send({ content: language.choose, components: [row] });
        const filter = (interaction) => {
            interaction.deferReply();
            return interaction.customId === 'select' && interaction.user.id === message.author.id;
        };
        const collector = msg.createMessageComponentCollector({ filter, time: 100000 });
        collector.on('collect', async (menu) => {
            await handleVideo([videos[menu.values[0]]], voiceChannel, false, serverQueue, 'yt', message);
            await menu.deleteReply();
        });
        collector.on('end', (menu) => {
            if (!menu.first()) {
                msg.delete();
                msg.channel.send(language.timeout);
            }
        });
    },
};
