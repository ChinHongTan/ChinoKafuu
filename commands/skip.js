module.exports = {
	name: 'skip',
	guildOnly: true,
    musicCommand: true,
	description: 'Skips a song.',
	execute(message, args) {
        const queueData = require("../queueData");
        let queue = queueData.queue;
        let serverQueue = queue.get(message.guild.id);

		function skip(message, serverQueue) {
            if (!message.member.voice.channel) {
                message.channel.send(
                    "You have to be in a voice channel to stop the music!"
                );
            } 
            if (!serverQueue){
                message.channel.send("There is no song that I could skip!");
            }
            serverQueue.connection.dispatcher.end();
        }
	    skip(message, serverQueue);
	},
};