const ytdl = require("ytdl-core");
const { PassThrough } = require("stream");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const Ffmpeg = require("fluent-ffmpeg");
Ffmpeg.setFfmpegPath(ffmpegPath);
const { Util, MessageEmbed } = require("discord.js");
const scdl = require("soundcloud-downloader").default;
const queueData = require("../data/queueData");
const scID = process.env.SCID || require("../config/config.json").scID;
let queue = queueData.queue;

async function play(guild, song, message) {
    let serverQueue = queue.get(message.guild.id);
    let stream = new PassThrough({
        highWaterMark: 50,
    });
    let proc;
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }
    switch (song.source) {
        case "yt":
            proc = new Ffmpeg(ytdl(song.url, {quality: "highestaudio"}));
            break;
        case "sc":
            proc = new Ffmpeg(await scdl.download(song.url, scID));
            break;
        default:
            proc = new Ffmpeg(ytdl(song.url));
            break;
    }

    proc.addOptions(["-ac", "2", "-f", "opus", "-ar", "48000"]);
    // proc.withAudioFilter("bass=g=5");
    proc.on("error", function (err) {
        if (err === "Output stream closed") {
            return;
        }
        console.log("an error happened: " + err.message);
        console.log(err);
    });
    proc.writeToStream(stream, {end: true});
    const dispatcher = serverQueue.connection
        .play(stream, {type: "ogg/opus"})
        .on("finish", (reason) => {
            if (reason === "Stream is not generating quickly enough.") {
                console.log("Stream is not generating quickly enough.");
            }
            console.log(reason);
            if (!serverQueue.loop) {
                let playedSong = serverQueue.songs.shift();
                serverQueue.songHistory.push(playedSong);
            }
            stream.destroy();
            play(guild, serverQueue.songs[0], message);
        })
        .on("error", (error) => {
            message.channel.send("An error happened!");
            console.log(error);
        });
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    var embed = new MessageEmbed()
        .setThumbnail(song.thumb)
        .setAuthor("開始撥放", message.author.displayAvatarURL())
        .setColor("BLUE")
        .setTitle(song.title)
        .setURL(song.url)
        .setTimestamp(Date.now())
        .addField("播放者", `<@!${serverQueue.songs[0].requseter}>`)
        .setFooter("音樂系統", message.client.user.displayAvatarURL());
    serverQueue.textChannel.send(embed);
}
function hmsToSecondsOnly(str) {
    var p = str.split(":"),
        s = 0, m = 1;

    while (p.length > 0) {
        s += m * parseInt(p.pop(), 10);
        m *= 60;
    }

    return s;
}
module.exports = {
    async waitimport(name, length, message) {
        return new Promise((resolve, reject) => {
            let embed = new MessageEmbed()
                .setAuthor("清單", message.author.displayAvatarURL())
                .setColor("BLUE")
                .setTitle("您要加入這個清單嗎")
                .setDescription(`清單: ${name}\n長度:${length}`)
                .setTimestamp(Date.now())
                .setFooter("音樂系統", message.client.user.displayAvatarURL());
            let m = await message.channel.send(embed);
            await m.react("📥");
            await m.react("❌");
            const filter = (reaction, user) => {
                ["📥", "❌"].includes(reaction.emoji.name) && user.id === message.author.id
            }
            let collected = await m.awaitReactions(filter, {
                maxEmojis: 1,
                time: 10000,
            });
            switch (collected.first()?.emoji?.name) {
                case undefined:
                    return;
                case "📥":
                    let embed = new MessageEmbed()
                        .setAuthor("清單", message.author.displayAvatarURL())
                        .setColor("BLUE")
                        .setTitle("您加入了清單")
                        .setDescription(`清單: ${name}`)
                        .setTimestamp(Date.now())
                        .setFooter("音樂系統", message.client.user.displayAvatarURL());
                    m.edit(embed);
                    return resolve(true);
                case "❌":
                    let embed = new MessageEmbed()
                        .setAuthor("清單", message.author.displayAvatarURL())
                        .setColor("BLUE")
                        .setTitle("您取消了加入清單")
                        .setDescription(`清單: ${name}`)
                        .setTimestamp(Date.now())
                        .setFooter("音樂系統", message.client.user.displayAvatarURL());
                    m.edit(embed);
                    return reject(false);
            }
        });
    },
    async handleVideo(videos, voiceChannel, playlist = false, serverQueue, source, message) {
        let song;
        switch (source) {
            case "ytlist":
                song = {
                    id: videos.id,
                    title: Util.escapeMarkdown(videos.title),
                    url: `https://www.youtube.com/watch?v=${videos.id}`,
                    requseter: message.member.id,
                    duration: hmsToSecondsOnly(videos.duration),
                    thumb: videos.thumbnails[0].url,
                    source: "yt",
                };
                break;
            case "yt":
                song = {
                    id: videos[0].id,
                    title: Util.escapeMarkdown(videos[0].title),
                    url: videos[0].url,
                    requseter: message.member.id,
                    duration: videos[0].duration / 1000,
                    thumb: videos[0].thumbnail.url,
                    source: "yt",
                };
                break;
            case "sc":
                song = {
                    id: videos.id,
                    title: Util.escapeMarkdown(videos.title),
                    url: videos.permalink_url,
                    requseter: message.member.id,
                    duration: videos.duration / 1000,
                    thumb: videos.artwork_url,
                    source: "sc",
                };
                break;
            default:
                break;
        }
        if (!serverQueue.songs[0]) {
            try {
                serverQueue.songs.push(song);
                var connection = await voiceChannel.join();
                serverQueue.connection = connection;
                play(message.guild, serverQueue.songs[0], message);
            } catch (error) {
                console.error(`I could not join the voice channel: ${error}`);
                serverQueue.songs.length = 0;
                return message.channel.send(`I could not join the voice channel: ${error}`);
            }
            return;
        }
        serverQueue.songs.push(song);
        if (playlist) {return;}
        var embed = new MessageEmbed()
            .setThumbnail(song.thumb)
            .setAuthor("已加入播放佇列", message.author.displayAvatarURL())
            .setColor("BLUE")
            .setTitle(song.title)
            .setURL(song.url)
            .setTimestamp(Date.now())
            .addField("播放者", `<@!${song.requseter}>`)
            .setFooter("音樂系統", message.client.user.displayAvatarURL());
        return message.channel.send(embed);
    },
    async play(guild, song, message) {
        play(guild, song, message);
    },
    format(duration) {
        // Hours, minutes and seconds
        var hrs = ~~(duration / 3600);
        var mins = ~~((duration % 3600) / 60);
        var secs = ~~duration % 60;

        // Output like "1:01" or "4:03:59" or "123:03:59"
        var ret = "";

        if (hrs > 0) {
            ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
        }

        ret += "" + mins + ":" + (secs < 10 ? "0" : "");
        ret += "" + secs;
        return ret;
    }
};
