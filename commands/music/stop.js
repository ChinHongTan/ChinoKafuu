module.exports = {
    name: "stop",
    guildOnly: true,
    description: {"en_US" : "Stops playing songs.", "zh_CN" : "停止播放"},
    execute(message, _args, language) {
        const queueData = require("../../data/queueData");
        let queue = queueData.queue;
        let serverQueue = queue.get(message.guild.id);

        function stop(message, serverQueue) {
            if (!message.member.voice.channel) {
                return message.channel.send(language.notInVC);
            }

            if (!serverQueue) return message.channel.send(language.noSong);

            serverQueue.songs = [];
            serverQueue.connection.dispatcher.end();
        }
        stop(message, serverQueue);
    },
};
