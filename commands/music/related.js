const { reply, warn } = require('../../functions/Util.js');
const ytsr = require('youtube-sr').default;
const { handleVideo, checkStats } = require('../../functions/musicFunctions');
const ytdl = require('ytdl-core');
const scdl = require('soundcloud-downloader').default;

async function related(command, language) {
    const serverQueue = await checkStats(command);
    if (serverQueue === 'error') return;

    const { voiceChannel } = serverQueue;
    const { songHistory } = serverQueue;
    const { songs } = serverQueue;
    const songHistoryUrls = songHistory.map((song) => song.url);
    const songUrls = songs.map((song) => song.url);
    const lastSong = songs[songs.length - 1];

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
        const urlList = relatedVideos.map((song) => song.video_url);
        const url = avoidRepeatedSongs(urlList);
        const videos = await ytsr.getVideo(url);
        await handleVideo([videos], voiceChannel, false, serverQueue, 'yt', command);
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

    await reply(command, language.relatedSearch, 'BLUE');
    let data, url, result, relatedVideos, urlList, relatedVidsInfo = [];
    let videos, authorId, bestTrack;

    switch (lastSong.source) {
    case 'sc':
        data = await scdl.getInfo(lastSong.url);
        relatedVideos = await scdl.related(data.id, 5, 0);
        urlList = videos.collection.map((song) => song.permalink_url);
        url = avoidRepeatedSongs(urlList);
        result = await scdl.getInfo(url).catch((err) => {
            console.log(err);
            throw warn(command, language.noResult);
        });
        await handleVideo(result, voiceChannel, false, serverQueue, 'sc', command);
        break;
    case 'yt':
        data = await ytdl.getInfo(lastSong.url);
        relatedVideos = data.related_videos;
        relatedVidsInfo = await getRelatedTrackInfo(relatedVideos);
        sortRelatedTracks(relatedVidsInfo);

        authorId = data.videoDetails.author.id;
        bestTrack = relatedVidsInfo.filter((vid) => vid.author.id === authorId && vid.mark > 0);
        if (bestTrack.length > 0) {
            await playRelatedTrack(bestTrack);
        } else {
            await playRelatedTrack(relatedVidsInfo);
        }
        break;
    }
}
module.exports = {
    name: 'related',
    guildOnly: true,
    aliases: ['re'],
    description: {
        'en_US': 'Play a related song',
        'zh_CN': '播放相关歌曲',
        'zh_TW': '播放相關歌曲',
    },
    async execute(message, _args, language) {
        await related(message, language);
    },
    slashCommand: {
        async execute(interaction, language) {
            await related(interaction, language);
        },
    },
};
