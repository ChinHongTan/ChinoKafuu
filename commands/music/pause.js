module.exports = {
    name: 'pause',
    guildOnly: true,
    description: 'Pause!',
    execute(message, _args, language) {
        const queueData = require('../../data/queueData');
        const { queue } = queueData;
        const serverQueue = queue.get(message.guild.id);

        if (!message.member.voice.channel) {
            return message.channel.send(language.notInVC);
        }

        if (serverQueue) {
            if (!serverQueue.playing) return message.channel.send('I am not playing!');
            serverQueue.connection.dispatcher.pause(true);
            serverQueue.playing = false;
            return message.channel.send('Paused!');
        }
        return message.channel.send(language.noSong);
    },
};
