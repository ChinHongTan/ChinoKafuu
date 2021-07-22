module.exports = {
    name: "related",
    guildOnly: true,
    aliases: ["re"],
    description: "Related song",
    async execute(message, args) {
        const scID = process.env.SCID || require("../../config/config.json").scID;
        const scdl = require("soundcloud-downloader").default;
        const queueData = require("../../data/queueData");
        let queue = queueData.queue;
        let serverQueue = queue.get(message.guild.id);
        let voiceChannel = serverQueue.voiceChannel;
        const play = require("./play");
        const { handleVideo } = require("../../functions/musicFunctions");

        if (serverQueue) {
            message.channel.send("Searching for related tracks...");
            let r = await scdl.getInfo(serverQueue.songs[0].url);
            let id = r.id;
            let s = await scdl.related(id, 1, 0);
            let url = s.collection[0].permalink_url;
            let data = await scdl.getInfo(url, scID).catch((err) => {
                console.log(err);
                throw message.channel.send(
                    "🆘 I could not obtain any search results."
                );
            });
            await handleVideo(
                data,
                voiceChannel,
                true,
                serverQueue,
                "sc",
                message
            );
        }
    },
};