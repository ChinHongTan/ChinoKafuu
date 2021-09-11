const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const commandReply = new CommandReply();

const ytsr = require('youtube-sr').default;
const ytpl = require('ytpl');
const SpotifyClientID = process.env.SPOTIFY_CLIENT_ID || require('../../config/config.json').SpotifyClientID;
const SpotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET || require('../../config/config.json').SpotifyClientSecret;
const scdl = require('soundcloud-downloader').default;
const Spotify = require('../../functions/spotify');
const spotify = new Spotify(SpotifyClientID, SpotifyClientSecret);
const { MessageActionRow, MessageSelectMenu, Message } = require('discord.js');

const { waitimport, handleVideo } = require('../../functions/musicFunctions');
const ytrx = new RegExp('(?:youtube\\.com.*(?:\\?|&)(?:v|list)=|youtube\\.com.*embed\\/|youtube\\.com.*v\\/|youtu\\.be\\/)((?!videoseries)[a-zA-Z0-9_-]*)');
const scrxt = new RegExp('^(?<track>https://soundcloud.com/(?:(?!sets|stats|groups|upload|you|mobile|stream|messages|discover|notifications|terms-of-use|people|pages|jobs|settings|logout|charts|imprint|popular)(?:[a-z0-9-_]{1,25}))/(?:(?:(?!sets|playlist|stats|settings|logout|notifications|you|messages)(?:[a-z0-9-_]{1,100}))(?:/s-[a-zA-Z0-9-_]{1,10})?))(?:[a-z0-9-?=/]*)$');
const sprxtrack = new RegExp('(http[s]?://)?(open.spotify.com)/');

async function play(command, args, language) {
    const { queue } = require('../../data/queueData');
    let serverQueue = queue.get(command.guild.id);
    const url = args[0];

    const voiceChannel = command.member.voice.channel;
    if (!voiceChannel) {
        return commandReply.reply(command, language.notInVC, 'RED');
    }
    const permissions = voiceChannel.permissionsFor(command.client.user);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
        return commandReply.reply(command, language.cantJoinVC, 'RED');
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
        const result = await waitimport(playlist.title, playlist.estimatedItemCount, command);
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
            result = await spotify.gettrack(Id);
            const videos = await ytsr.search(
                `${result.artists[0].name} ${result.name}`,
                { limit: 1 },
            );
            return await handleVideo(videos, voiceChannel, false, serverQueue, 'yt', command);
        }

        if (link.includes('album')) {
            result = await spotify.getAlbum(Id);
            const title = result.name;
            const m = await commandReply.reply(command, language.importAlbum1.replace('${title}', title), 'BLUE');
            for (const i in result.tracks.items) {
                const videos = await ytsr.search(
                    `${result.artists[0].name} ${result.tracks.items[i].name}`,
                    { limit: 1 },
                );
                await handleVideo(videos, voiceChannel, true, serverQueue, 'yt', command);
                m.edit(language.importAlbum2.replace('${videos[0].title}', videos[0].title).replace('${i}', i));
            }
            return m.edit(language.importAlbumDone.replace('${title}', title));
        }

        if (link.includes('playlist')) {
            result = await spotify.getplaylist(Id);

            const title = result.name;
            const lenght = result.tracks.total;

            const wait = await waitimport(title, lenght, command);
            if (!wait) {
                const videos = await ytsr.search(
                    `${result.tracks.items[0].track.artists[0].name} ${result.tracks.items[0].track.name}`,
                    { limit: 1 },
                );
                return await handleVideo(videos, voiceChannel, false, serverQueue, 'yt', command);
            }

            const m = await commandReply.reply(command, language.importPlaylist1.replace('${title}', title), 'BLUE');
            // eslint-disable-next-line no-constant-condition
            while (true) {
                for (const i in result.tracks.items) {
                    const videos = await ytsr.search(
                        `${result.tracks.items[i].track.artists[0].name} ${result.tracks.items[i].track.name}`,
                        { limit: 1 },
                    );
                    await handleVideo(videos, voiceChannel, true, serverQueue, 'yt', command);
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
            const data = await scdl.getSetInfo(link).catch((err) => {
                console.log(err);
                return commandReply.reply(command, language.noResult, 'RED');
            });
            const wait = await waitimport(data.title, data.tracks.length, command);
            let m;
            if (wait) {
                m = await commandReply.reply(command, language.importPlaylist1.replace('${data.title}', data.title), 'BLUE');
                for (const i in data.tracks) {
                    await handleVideo(data.tracks[i], voiceChannel, true, serverQueue, 'sc', command);
                    m.edit(language.importPlaylist2.replace('${data.tracks[i].title}', data.tracks[i].title).replace('${i}', i));
                }
            }
            return m.edit(language.importPlaylistDone.replace('${data.title}', data.title));
        }
        if (link.match(scrxt)) {
            const data = await scdl.getInfo(link).catch((err) => {
                console.log(err);
                throw commandReply.reply(command, language.noResult, 'RED');
            });
            await handleVideo(data, voiceChannel, true, serverQueue, 'sc', command);
        }
    }

    if (!args[0]) return commandReply.reply(command, language.noArgs, 'RED');
    if (url.match(ytrx)) return processYoutubeLink(url);
    if (url.includes('open.spotify.com')) return processSpotifyLink(url);
    if (url.includes('soundcloud.com')) return processSoundcloudLink(url);

    const keyword = command instanceof Message ? command.content.substr(command.content.indexOf(' ') + 1) : args;
    let msg = await commandReply.reply(command, language.searching.replace('${keyword}', keyword), 'YELLOW');
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
    const filter = (interaction) => {
        interaction.deferReply();
        return interaction.customId === 'select' && interaction.user.id === command.member.id;
    };
    const collector = msg.createMessageComponentCollector({ filter, time: 100000 });
    collector.on('collect', async (menu) => {
        await handleVideo([videos[menu.values[0]]], voiceChannel, false, serverQueue, 'yt', command);
        msg.delete();
    });
    collector.on('end', (menu) => {
        if (!menu.first()) {
            msg.delete();
            msg.channel.send(language.timeout);
        }
    });
}
module.exports = {
    name: 'play',
    guildOnly: true,
    aliases: ['p'],
    description: true,
    async execute(message, args, language) {
        await play(message, args, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder()
            .addStringOption((option) => option.setName('song').setDescription('link/keyword').setRequired(true)),
        async execute(interaction, language) {
            await play(interaction, interaction.options.getString('song'), language);
        },
    },
};
