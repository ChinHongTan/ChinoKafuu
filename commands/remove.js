module.exports = {
	name: 'remove',
	guildOnly: true,
    musicCommand: true,
	description: 'Removes a song from the queue',
	execute(message, args) {
        const queueData = require("../queueData");
        let queue = queueData.queue;
        let serverQueue = queue.get(message.guild.id);

        if (message.channel.type === "dm"){
            message.channel.send(
                "I can't execute that command inside DMs!"
            );
        }
        if (serverQueue) {
            args.forEach((number) => {
                queuenum = Number(number);
                if (
                    Number.isInteger(queuenum) &&
                    queuenum <= serverQueue.songs.length &&
                    queuenum > 0
                ) {
                    message.channel.send(`Removed ${serverQueue.songs[queuenum].title}!`)
                    serverQueue.songs.splice(queuenum, 1);
                } else {
                    message.channel.send("You have to enter a valid integer!");
                }
            });
        }
	},
};