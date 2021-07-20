module.exports = {
    name: "skip",
    guildOnly: true,
    aliases: ["s"],
    description: "Skips a song.",
    execute(message) {
        const queueData = require("../data/queueData");
        let queue = queueData.queue;
        let serverQueue = queue.get(message.guild.id);

        function skip(message, serverQueue) {
            if (!message.member.voice.channel) {
                return message.channel.send(
                    "You have to be in a voice channel to skip the music!"
                );
            }
            if (!serverQueue) {
                return message.channel.send("There is no song that I could skip!");
            }
            serverQueue.connection.dispatcher.end();
        }
        skip(message, serverQueue);
    },
};
