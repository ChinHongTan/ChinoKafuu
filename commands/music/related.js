module.exports = {
    name: 'related',
    guildOnly: true,
    aliases: ['re'],
    description: true,
    async execute(message, _args, language) {
        // const scID = process.env.SCID || require("../../config/config.json").scID;
        const scdl = require('soundcloud-downloader').default;
        const ytdl = require('ytdl-core');
        const ytsr = require('youtube-sr').default;
        const queueData = require('../../data/queueData');
        const { queue } = queueData;
        const serverQueue = queue.get(message.guild.id);
        if (!serverQueue) {
            return message.channel.send(language.notPlayingMusic);
        }
        const { voiceChannel } = serverQueue;
        const { songHistory } = serverQueue;
        const { songs } = serverQueue;
        const songHistoryUrls = songHistory.map((song) => song.url);
        const songUrls = songs.map((song) => song.url);
        const lastSong = songs[songs.length - 1];
        const { handleVideo } = require('../../functions/musicFunctions');

        function avoidRepeatedSongs(result) {
            let url;
            for (let i = 0; i < result.length; i++) {
                url = result[i];
                if (songHistoryUrls.includes(url) || songUrls.includes(url)) {
                    result.splice(i, 1);
                }
                else {
                    break;
                }
            }
            return url;
        }

        async function playRelatedTrack(relatedVideos) {
            const urlList = relatedVideos.map((song) => song.video_url);
            const url = avoidRepeatedSongs(urlList);
            const videos = await ytsr.getVideo(url);
            await handleVideo([videos], voiceChannel, false, serverQueue, 'yt', message);
        }

        async function getRelatedTrackInfo(relatedVideos) {
            const relatedVidsInfo = [];
            await Promise.all(
                relatedVideos.map(async (vid) => {
                    const searchUrl = `https://www.youtube.com/watch?v=${vid.id}`;
                    const response = await ytdl.getBasicInfo(searchUrl);
                    relatedVidsInfo.push(response.videoDetails);
                }),
            );
            return relatedVidsInfo;
        }

        function sortRelatedTracks(relatedVidsInfo) {
            let mark = 0;
            relatedVidsInfo.forEach((item) => {
                if (item.media.category === 'Music') mark += 1;
                if (item.category === 'Music') mark += 2;
                item.mark = mark;
            });

            relatedVidsInfo.sort((a, b) => b.mark - a.mark);
            return relatedVidsInfo;
        }

        if (!lastSong) return message.channel.send(language.noSong);

        message.channel.send(language.relatedSearch);
        let data; let url; let result; let relatedVideos; let urlList; let relatedVidsInfo = [];
        let videos; let authorId; let bestTrack;

        switch (lastSong.source) {
        case 'sc':
            data = await scdl.getInfo(lastSong.url);
            relatedVideos = await scdl.related(data.id, 5, 0);
            urlList = videos.collection.map((song) => song.permalink_url);
            url = avoidRepeatedSongs(urlList);
            result = await scdl.getInfo(url).catch((err) => {
                console.log(err);
                throw message.channel.send(language.noResult);
            });
            await handleVideo(result, voiceChannel, false, serverQueue, 'sc', message);
            break;
        case 'yt':
            data = await ytdl.getInfo(lastSong.url);
            relatedVideos = data.related_videos;
            relatedVidsInfo = await getRelatedTrackInfo(relatedVideos);
            sortRelatedTracks(relatedVidsInfo);

            authorId = data.videoDetails.author.id;
            bestTrack = relatedVidsInfo.filter((vid) => vid.author.id === authorId && vid.mark > 0);
            if (bestTrack.length > 0) {
                playRelatedTrack(bestTrack);
            }
            else {
                playRelatedTrack(relatedVidsInfo);
            }
            break;
        }
    },
};
