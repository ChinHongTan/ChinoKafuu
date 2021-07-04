module.exports = {
	name: 'stop',
	guildOnly: true,
    musicCommand: true,
	description: 'Stops playing songs.',
	execute(message, args, serverQueue, queue) {
		function stop(message, serverQueue) {
            if (!message.member.voice.channel){
                message.channel.send(
                    "You have to be in a voice channel to stop the music!"
                );
                return [serverQueue, queue];
            }
        
            if (!serverQueue){
                message.channel.send("There is no song that I could stop!");
                return [serverQueue, queue];
            }
        
            serverQueue.songs = [];
            serverQueue.connection.dispatcher.end();
            return [serverQueue, queue];
        }
        [serverQueue, queue] = stop(message, serverQueue);
        return [serverQueue, queue];
	},
};