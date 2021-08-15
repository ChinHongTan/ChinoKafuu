module.exports = {
    name: "related",
    guildOnly: true,
    aliases: ["re"],
    description: {"en_US" : "Related song", "zh_CN" : "相关歌曲"},
    async execute(message, _args, language) {
        // const scID = process.env.SCID || require("../../config/config.json").scID;
        const scdl = require("soundcloud-downloader").default;
        const ytdl = require("ytdl-core");
        const ytsr = require("youtube-sr").default;
        const queueData = require("../../data/queueData");
        let queue = queueData.queue;
        let serverQueue = queue.get(message.guild.id);
        if (!serverQueue) {
            return message.channel.send(language.notPlayingMusic);
        }
        let voiceChannel = serverQueue.voiceChannel;
        let songHistory = serverQueue.songHistory;
        let songs = serverQueue.songs;
        let songHistoryUrls = songHistory.map((song) => song.url);
        let songUrls = songs.map((song) => song.url);
        let lastSong = songs[songs.length - 1];
        const { handleVideo } = require("../../functions/musicFunctions");

        function avoidRepeatedSongs(result) {
            let url;
            for (let i = 0; i < result.length; i++) {
                url = result[i];
                if (songHistoryUrls.includes(url) || songUrls.includes(url)) {
                    result.splice(i, 1);
                } else {
                    break;
                }
            }
            return url;
        }

        async function playRelatedTrack(relatedVideos) {
            let urlList = relatedVideos.map((song) => song.video_url);
            let url = avoidRepeatedSongs(urlList);
            let videos = await ytsr.getVideo(url);
            await handleVideo([videos], voiceChannel, false, serverQueue, "yt", message);
        }

        async function getRelatedTrackInfo(relatedVideos) {
            let relatedVidsInfo = [];
            await Promise.all(
                relatedVideos.map(async (vid) => {
                    let searchUrl = `https://www.youtube.com/watch?v=${vid.id}`;
                    let response = await ytdl.getBasicInfo(searchUrl);
                    relatedVidsInfo.push(response.videoDetails);
                })
            );
            return relatedVidsInfo;
        }

        function sortRelatedTracks(relatedVidsInfo) {
            let mark = 0;
            relatedVidsInfo.forEach((item) => {
                if (item.media.category === "Music") mark += 1;
                if (item.category === "Music") mark += 2;
                item.mark = mark;
            });
            
            relatedVidsInfo.sort((a, b) => b.mark - a.mark);
            return relatedVidsInfo;
        }

        if (!lastSong) return message.channel.send(language.noSong);

        message.channel.send(language.relatedSearch);
        let data, url, result, relatedVideos, urlList, relatedVidsInfo = []
        let videos, authorId, bestTrack;
        
        switch (lastSong.source) {
            case "sc":
                data = await scdl.getInfo(lastSong.url);
                relatedVideos = await scdl.related(data.id, 5, 0);
                urlList = videos.collection.map((song) => song.permalink_url);
                url = avoidRepeatedSongs(urlList);
                result = await scdl.getInfo(url).catch((err) => {
                    console.log(err);
                    throw message.channel.send(language.noResult);
                });
                await handleVideo(result, voiceChannel, false, serverQueue, "sc", message);
                break;
            case "yt":
                data = await ytdl.getInfo(lastSong.url);
                relatedVideos = data.related_videos;
                relatedVidsInfo = await getRelatedTrackInfo(relatedVideos);
                sortRelatedTracks(relatedVidsInfo);

                authorId = data.videoDetails.author.id;
                bestTrack = relatedVidsInfo.filter((vid) => vid.author.id === authorId && vid.mark > 0);
                if (bestTrack.length > 0) {
                    playRelatedTrack(bestTrack);
                } else {
                    playRelatedTrack(relatedVidsInfo);
                }
                break;
        }
    },
};
