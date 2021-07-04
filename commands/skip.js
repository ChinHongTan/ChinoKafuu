module.exports = {
	name: 'skip',
	guildOnly: true,
    musicCommand: true,
	description: 'Skips a song.',
	execute(message, args, serverQueue, queue) {
		function skip(message, serverQueue) {
            if (!message.member.voice.channel) {
                message.channel.send(
                    "You have to be in a voice channel to stop the music!"
                );
                return [serverQueue, queue];
            } 
            if (!serverQueue){
                message.channel.send("There is no song that I could skip!");
                return [serverQueue, queue];
            }
            serverQueue.connection.dispatcher.end();
            return [serverQueue, queue];
        }
		[serverQueue, queue] = skip(message, serverQueue);
        return [serverQueue, queue];
	},
};