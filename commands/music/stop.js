module.exports = {
    name: "stop",
    guildOnly: true,
    description: true,
    execute(message, _args, language) {
        const queueData = require("../../data/queueData");
        let queue = queueData.queue;
        let serverQueue = queue.get(message.guild.id);

        if (!message.member.voice.channel) {
            return message.channel.send(language.notInVC);
        }

        if (!serverQueue) return message.channel.send(language.noSong);

        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
    },
};
