const ytdl = require("ytdl-core");
const { PassThrough } = require("stream");
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);
const { Util, MessageEmbed } = require("discord.js");
const scdl = require("soundcloud-downloader").default;
const queueData = require("../data/queueData");
const scID = process.env.SCID || require("../config/config.json").scID;
let queue = queueData.queue;
async function play(guild, song, message) {
    let serverQueue = queue.get(message.guild.id);
    let stream = new PassThrough({
        highWaterMark: 12,
    });
    let proc;
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }
    switch (song.source) {
        case "yt":
            proc = new ffmpeg(
                ytdl(song.url, {
                    quality: "highestaudio",
                })
            );
            break;
        case "sc":
            proc = new ffmpeg(await scdl.download(song.url, scID));
            break;
        default:
            proc = new ffmpeg(ytdl(song.url));
            break;
    }

    proc.addOptions(["-ac", "2", "-f", "opus", "-ar", "48000"]);
    proc.on("error", function (err) {
        if (err === "Output stream closed") {
            return;
        }
        console.log("an error happened: " + err.message);
        console.log(err);
    });
    proc.writeToStream(stream, {
        end: true,
    });
    const dispatcher = serverQueue.connection
        .play(stream, {
            type: "ogg/opus",
        })
        .on("finish", (reason) => {
            if (reason === "Stream is not generating quickly enough.") {
                console.log("Stream is not generating quickly enough.");
            }
            console.log(reason);
            if (!serverQueue.loop) {
                serverQueue.songs.shift();
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
};
function hmsToSecondsOnly(str) {
    var p = str.split(':'),
        s = 0, m = 1;

    while (p.length > 0) {
        s += m * parseInt(p.pop(), 10);
        m *= 60;
    }

    return s;
}
module.exports = {
    waitimport: async function (name, length, message) {
        return new Promise((resolve, reject) => {
            let embed = new MessageEmbed()
                .setAuthor("清單", message.author.displayAvatarURL())
                .setColor("BLUE")
                .setTitle("您要加入這個清單嗎")
                .setDescription(`清單: ${name}\n長度:${length}`)
                .setTimestamp(Date.now())
                .setFooter("音樂系統", message.client.user.displayAvatarURL());
            message.channel.send(embed).then(async (m) => {
                await m.react("📥");
                await m.react("❌");
                let filter = (reaction, user) => {
                    if (user.id === message.author.id) {
                        if (reaction.emoji.name === "📥") {
                            return true;
                        }
                        if (reaction.emoji.name === "❌") {
                            return true;
                        }
                    }
                };
                m.awaitReactions(filter, {
                    maxEmojis: 1,
                    time: 10000,
                })
                    .then((collected) => {
                        if (!collected.first()) {
                            return;
                        }
                        if (collected.first().emoji.name === "📥") {
                            let embed = new MessageEmbed()
                                .setAuthor(
                                    "清單",
                                    message.author.displayAvatarURL()
                                )
                                .setColor("BLUE")
                                .setTitle("您加入了清單")
                                .setDescription(`清單: ${name}`)
                                .setTimestamp(Date.now())
                                .setFooter(
                                    "音樂系統",
                                    message.client.user.displayAvatarURL()
                                );
                            m.edit(embed);
                            return resolve(true);
                        }
                        if (collected.first().emoji.name === "❌") {
                            let embed = new MessageEmbed()
                                .setAuthor(
                                    "清單",
                                    message.author.displayAvatarURL()
                                )
                                .setColor("BLUE")
                                .setTitle("您取消了加入清單")
                                .setDescription(`清單: ${name}`)
                                .setTimestamp(Date.now())
                                .setFooter(
                                    "音樂系統",
                                    message.client.user.displayAvatarURL()
                                );
                            m.edit(embed);
                            return reject(false);
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        reject(false);
                    });
            });
        });
    },
    handleVideo: async function (
        videos,
        voiceChannel,
        playlist = false,
        serverQueue,
        source,
        message
    ) {
        let song;
        switch (source) {
            case "ytlist":
                console.log(videos.title);
                console.log(videos.duration);
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
                console.log(videos[0].duration);
                console.log(videos[0].duration);
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
                console.log(videos.title);
                console.log(videos.duration);
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
                return message.channel.send(
                    `I could not join the voice channel: ${error}`
                );
            }
        } else {
            serverQueue.songs.push(song);
            if (playlist) return;
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
        }
    },
};
