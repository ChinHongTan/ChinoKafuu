module.exports = {
    name: "stop",
    guildOnly: true,
    description: "Stops playing songs.",
    execute(message) {
        const queueData = require("../../data/queueData");
        let queue = queueData.queue;
        let serverQueue = queue.get(message.guild.id);

        function stop(message, serverQueue) {
            if (!message.member.voice.channel) {
                return message.channel.send("You have to be in a voice channel to stop the music!");
            }

            if (!serverQueue) return message.channel.send("There is no song that I could stop!");

            serverQueue.songs = [];
            serverQueue.connection.dispatcher.end();
        }
        stop(message, serverQueue);
    },
};
