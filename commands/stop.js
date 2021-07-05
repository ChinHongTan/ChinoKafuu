module.exports = {
	name: 'stop',
	guildOnly: true,
    musicCommand: true,
	description: 'Stops playing songs.',
	execute(message, args) {
        const queueData = require("../data/queueData");
        let queue = queueData.queue;
        let serverQueue = queue.get(message.guild.id);

		function stop(message, serverQueue) {
            if (!message.member.voice.channel){
                message.channel.send(
                    "You have to be in a voice channel to stop the music!"
                );
            }
        
            if (!serverQueue){
                message.channel.send("There is no song that I could stop!");
            }
        
            serverQueue.songs = [];
            serverQueue.connection.dispatcher.end();
        }
        stop(message, serverQueue);
	},
};