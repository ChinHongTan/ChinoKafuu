module.exports = {
    name: "loop",
    guildOnly: true,
    description: "Loop the currently played song!",
    execute(message, _args, language) {
        const queueData = require("../../data/queueData");
        let queue = queueData.queue;
        let serverQueue = queue.get(message.guild.id);

        if (!message.member.voice.channel) {
            return message.channel.send(language.notInVC);
        }

        if (serverQueue) {
            serverQueue.loop = !serverQueue.loop;
            if (serverQueue.loopQueue) serverQueue.loopQueue = false;
            return message.channel.send(serverQueue.loop ? "Loop mode on!" : "Loop mode off!");
        } else {
            return message.channel.send(language.noSong);
        }
    },
};