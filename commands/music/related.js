module.exports = {
    name: "related",
    guildOnly: true,
    aliases: ["re"],
    description: "Related song",
    async execute(message) {
        // const scID = process.env.SCID || require("../../config/config.json").scID;
        const scdl = require("soundcloud-downloader").default;
        const ytdl = require("ytdl-core");
        let info = await ytdl.getInfo('https://www.youtube.com/watch?v=VyOVykOzvoE');
        // console.log(info.related_videos);
        const queueData = require("../../data/queueData");
        let queue = queueData.queue;
        let serverQueue = queue.get(message.guild.id);
        if (!serverQueue) {
            return message.channel.send("I'm not playing any songs right now!");
        }
        let voiceChannel = serverQueue.voiceChannel;
        const { handleVideo, play } = require("../../functions/musicFunctions");

        message.channel.send("Searching for related tracks...");
        let r = await scdl.getInfo(serverQueue.songs[serverQueue.songs.length - 1].url);
        let id = r.id;
        let s = await scdl.related(id, 5, 0);
        console.log(Math.floor(Math.random() * 5));
        let url = s.collection[Math.floor(Math.random() * 5)].permalink_url;
        let data = await scdl.getInfo(url).catch((err) => {
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
    },
};