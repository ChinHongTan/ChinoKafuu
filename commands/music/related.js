module.exports = {
    name: "related",
    guildOnly: true,
    aliases: ["re"],
    description: "Related song",
    async execute(message) {
        // const scID = process.env.SCID || require("../../config/config.json").scID;
        const scdl = require("soundcloud-downloader").default;
        const ytdl = require("ytdl-core");
        const ytsr = require("youtube-sr").default;
        const queueData = require("../../data/queueData");
        let queue = queueData.queue;
        let serverQueue = queue.get(message.guild.id);
        if (!serverQueue) {
            return message.channel.send("I'm not playing any songs right now!");
        }
        let voiceChannel = serverQueue.voiceChannel;
        let songHistory = serverQueue.songHistory;
        let songs = serverQueue.songs;
        let songHistoryUrls = songHistory.map((song) => song.url);
        let songUrls = songs.map((song) => song.url);
        let lastSong = songs[songs.length - 1];
        const { handleVideo } = require("../../functions/musicFunctions");

        function avoidRepeatedSongs(result) {
            let url, index = 0;
            for (let i = 0; i < result.length; i++) {
                url = result[index];
                if (songHistoryUrls.includes(url) || songUrls.includes(url)) {
                    result.splice(index, 1);
                } else {
                    break;
                }
            }
            return url;
        }

        message.channel.send("Searching for related tracks...");
        let data, url, result, videos;
        
        switch (lastSong.source) {
            case "sc":
                let r = await scdl.getInfo(lastSong.url);
                let id = r.id;
                let s = await scdl.related(id, 5, 0);
                result = s.collection.map((song) => song.permalink_url);
                url = avoidRepeatedSongs(result);
                data = await scdl.getInfo(url).catch((err) => {
                    console.log(err);
                    throw message.channel.send(
                        "🆘 I could not obtain any search results."
                    );
                });
                await handleVideo(
                    data,
                    voiceChannel,
                    false,
                    serverQueue,
                    "sc",
                    message
                );
                break;
            case "yt":
                data = await ytdl.getInfo(lastSong.url);
                result = data.related_videos.map((song) => `https://www.youtube.com/watch?v=${song.id}`);
                url = avoidRepeatedSongs(result);
                videos = await ytsr.getVideo(url);
                await handleVideo(
                    [videos],
                    voiceChannel,
                    false,
                    serverQueue,
                    "yt",
                    message
                );
                break;
            default:
                data = await ytdl.getInfo(lastSong.url);
                result = data.related_videos.map((song) => `https://www.youtube.com/watch?v=${song.id}`);
                url = avoidRepeatedSongs(result);
                videos = await ytsr.getVideo(url);
                await handleVideo(
                    [videos],
                    voiceChannel,
                    false,
                    serverQueue,
                    "yt",
                    message
                );
                break;
        }
    },
};