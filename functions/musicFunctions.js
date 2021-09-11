const ytdl = require('ytdl-core');
const { PassThrough } = require('stream');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const Ffmpeg = require('fluent-ffmpeg');

const CommandReply = require('./commandReply.js');
const commandReply = new CommandReply();

Ffmpeg.setFfmpegPath(ffmpegPath);
const { Util, MessageEmbed } = require('discord.js');
const scdl = require('soundcloud-downloader').default;
const queueData = require('../data/queueData');
const scID = process.env.SCID || require('../config/config.json').scID;
const {
    AudioPlayerStatus,
    StreamType,
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
} = require('@discordjs/voice');

const { queue } = queueData;

async function play(guild, song, message) {
    const serverQueue = queue.get(message.guild.id);
    const stream = new PassThrough({
        highWaterMark: 50,
    });
    let proc;
    if (!song) {
        serverQueue.player.stop(true);
        serverQueue.connection.destroy();
        queue.delete(guild.id);
        return;
    }
    switch (song.source) {
    case 'yt':
        proc = new Ffmpeg(ytdl(song.url, { quality: 'highestaudio', filter: 'audioonly', highWaterMark: 1 << 25 }));
        break;
    case 'sc':
        proc = new Ffmpeg(await scdl.download(song.url));
        break;
    default:
        proc = new Ffmpeg(ytdl(song.url, { quality: 'highestaudio', filter: 'audioonly', highWaterMark: 1 << 25 }));
        break;
    }

    proc.addOptions(['-ac', '2', '-f', 'opus', '-ar', '48000']);
    // proc.withAudioFilter("bass=g=5");
    proc.on('error', (err) => {
        if (err.message === 'Output stream closed') {
            return;
        }
        console.log(`an error happened: ${err.message}`);
        console.log(err);
    });
    proc.writeToStream(stream, { end: true });
    const resource = createAudioResource(stream, {
        inputType: StreamType.Arbitrary,
        inlineVolume: true,
    });
    const player = createAudioPlayer();
    player.play(resource);
    serverQueue.player = player;
    serverQueue.connection.subscribe(player);
    player
        .on(AudioPlayerStatus.Idle, () => {
            const playedSong = serverQueue.songs.shift();
            if (!serverQueue.loop) serverQueue.songHistory.push(playedSong);
            if (serverQueue.loopQueue) serverQueue.songs.push(playedSong);
            if (serverQueue.loop) serverQueue.songs.unshift(playedSong);
            stream.destroy();
            play(guild, serverQueue.songs[0], message);
        })
        .on('error', (error => {
            message.channel.send('An error happened!');
            console.log(error);
        }));
    resource.volume.setVolume(serverQueue.volume / 5);
    const embed = new MessageEmbed()
        .setThumbnail(song.thumb)
        .setAuthor('開始撥放', message.member.user.displayAvatarURL())
        .setColor('BLUE')
        .setTitle(song.title)
        .setURL(song.url)
        .setTimestamp(Date.now())
        .addField('播放者', `<@!${serverQueue.songs[0].requseter}>`)
        .setFooter('音樂系統', message.client.user.displayAvatarURL());
    serverQueue.textChannel.send({ embeds: [embed] });
}
function hmsToSecondsOnly(str) {
    const p = str.split(':');
    let s = 0; let m = 1;

    while (p.length > 0) {
        s += m * parseInt(p.pop(), 10);
        m *= 60;
    }

    return s;
}
module.exports = {
    async waitimport(name, length, message) {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            let embed = new MessageEmbed()
                .setAuthor('清單', message.member.user.displayAvatarURL())
                .setColor('BLUE')
                .setTitle('您要加入這個清單嗎')
                .setDescription(`清單: ${name}\n長度:${length}`)
                .setTimestamp(Date.now())
                .setFooter('音樂系統', message.client.user.displayAvatarURL());
            const m = await commandReply.edit(message, embed);
            await m.react('📥');
            await m.react('❌');
            const filter = (reaction, user) => ['📥', '❌'].includes(reaction.emoji.name) && user.id === message.member.user.id;
            const collected = await m.awaitReactions({
                filter,
                maxEmojis: 1,
                time: 10000,
            });
            switch (collected.first()?.emoji?.name) {
            case undefined:
                return;
            case '📥':
                embed = new MessageEmbed()
                    .setAuthor('清單', message.member.user.displayAvatarURL())
                    .setColor('BLUE')
                    .setTitle('您加入了清單')
                    .setDescription(`清單: ${name}`)
                    .setTimestamp(Date.now())
                    .setFooter('音樂系統', message.client.user.displayAvatarURL());
                await commandReply.edit(m, embed);
                return resolve(true);
            case '❌':
                embed = new MessageEmbed()
                    .setAuthor('清單', message.member.user.displayAvatarURL())
                    .setColor('BLUE')
                    .setTitle('您取消了加入清單')
                    .setDescription(`清單: ${name}`)
                    .setTimestamp(Date.now())
                    .setFooter('音樂系統', message.client.user.displayAvatarURL());
                await commandReply.edit(m, embed);
                return reject(false);
            }
        });
    },
    async handleVideo(videos, voiceChannel, playlist = false, serverQueue, source, message) {
        let song;
        switch (source) {
        case 'ytlist':
            song = {
                id: videos.id,
                title: Util.escapeMarkdown(videos.title),
                url: `https://www.youtube.com/watch?v=${videos.id}`,
                requseter: message.member.id,
                duration: hmsToSecondsOnly(videos.duration),
                thumb: videos.thumbnails[0].url,
                source: 'yt',
            };
            break;
        case 'yt':
            song = {
                id: videos[0].id,
                title: Util.escapeMarkdown(videos[0].title),
                url: videos[0].url,
                requseter: message.member.id,
                duration: videos[0].duration / 1000,
                thumb: videos[0].thumbnail.url,
                source: 'yt',
            };
            break;
        case 'sc':
            song = {
                id: videos.id,
                title: Util.escapeMarkdown(videos.title),
                url: videos.permalink_url,
                requseter: message.member.id,
                duration: videos.duration / 1000,
                thumb: videos.artwork_url,
                source: 'sc',
            };
            break;
        default:
            break;
        }
        if (!serverQueue.songs[0]) {
            try {
                serverQueue.songs.push(song);
                serverQueue.connection = await joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: voiceChannel.guildId,
                    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
                });
                await play(message.guild, serverQueue.songs[0], message);
            }
            catch (error) {
                console.error(error);
                serverQueue.songs.length = 0;
                return message.channel.send(`I could not join the voice channel: ${error}`);
            }
            return;
        }
        serverQueue.songs.push(song);
        if (playlist) return;
        const embed = new MessageEmbed()
            .setThumbnail(song.thumb)
            .setAuthor('已加入播放佇列', message.member.user.displayAvatarURL())
            .setColor('BLUE')
            .setTitle(song.title)
            .setURL(song.url)
            .setTimestamp(Date.now())
            .addField('播放者', `<@!${song.requseter}>`)
            .setFooter('音樂系統', message.client.user.displayAvatarURL());
        return commandReply.edit(message, embed);
    },
    async play(guild, song, message) {
        await play(guild, song, message);
    },
    format(duration) {
        // Hours, minutes and seconds
        const hrs = ~~(duration / 3600);
        const mins = ~~((duration % 3600) / 60);
        const secs = ~~duration % 60;

        // Output like "1:01" or "4:03:59" or "123:03:59"
        let ret = '';

        if (hrs > 0) {
            ret += `${hrs}:${mins < 10 ? '0' : ''}`;
        }

        ret += `${mins}:${secs < 10 ? '0' : ''}`;
        ret += `${secs}`;
        return ret;
    },
};
