module.exports = {
    name: "resume",
    guildOnly: true,
    description: "Resume playing!",
    execute(message, _args, language) {
        const queueData = require("../../data/queueData");
        let queue = queueData.queue;
        let serverQueue = queue.get(message.guild.id);

        if (!message.member.voice.channel) {
            return message.channel.send(language.notInVC);
        }

        if (serverQueue) {
            if (serverQueue.playing) return message.channel.send("I am already playing!");
            serverQueue.connection.dispatcher.resume();
            serverQueue.playing = true;
            return message.channel.send("Resumed!");
        } else {
            return message.channel.send(language.noSong);
        }
    },
};