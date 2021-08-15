module.exports = {
    name: "loop-queue",
    guildOnly: true,
    aliases: ["lq", "loopqueue"],
    description: "Loop the currently played queue!",
    execute(message, _args, language) {
        const queueData = require("../../data/queueData");
        let queue = queueData.queue;
        let serverQueue = queue.get(message.guild.id);

        if (!message.member.voice.channel) {
            return message.channel.send(language.notInVC);
        }

        if (serverQueue) {
            serverQueue.loopQueue = !serverQueue.loopQueue;
            if (serverQueue.loop) serverQueue.loop = false;
            return message.channel.send(serverQueue.loopQueue ? "Loop queue on!" : "Loop queue off!");
        } else {
            return message.channel.send(language.noSong);
        }
    },
};