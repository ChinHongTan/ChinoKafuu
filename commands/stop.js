module.exports = {
    name: 'stop',
    guildOnly: true,
    musicCommand: true,
    description: 'Stops playing songs.',
    execute(client, message, args) {
        let serverQueue = client.queue.get(message.guild.id);
        if (!message.member.voice.channel) {
            message.channel.send(
                "You have to be in a voice channel to stop the music!");
        }
        if (!serverQueue) {
            message.channel.send("There is no song that I could stop!");
        }

        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
    },
};