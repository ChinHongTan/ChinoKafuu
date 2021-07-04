module.exports = {
	name: 'remove',
	guildOnly: true,
    musicCommand: true,
	description: 'Removes a song from the queue',
	execute(message, args, serverQueue, queue) {
        if (message.channel.type === "dm"){
            message.channel.send(
                "I can't execute that command inside DMs!"
            );
            return [serverQueue, queue];
        }
        if (serverQueue) {
            args.forEach((number) => {
                queuenum = Number(number);
                if (
                    Number.isInteger(queuenum) &&
                    queuenum <= serverQueue.songs.length &&
                    queuenum > 0
                ) {
                    serverQueue.songs.splice(queuenum, 1);
                    return [serverQueue, queue];
                } else {
                    message.channel.send("You have to enter a valid integer!");
                    return [serverQueue, queue];
                }
            });
        }
	},
};