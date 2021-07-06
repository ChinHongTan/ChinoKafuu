module.exports = {
	name: 'remove',
	guildOnly: true,
    aliases: ['r'],
	description: 'Removes a song from the queue',
	execute(client, message, args) {
        let serverQueue = client.queue.get(message.guild.id);
        if (serverQueue) {
            args.forEach((number) => {
                queuenum = Number(number);
                if (
                    Number.isInteger(queuenum) &&
                    queuenum <= serverQueue.songs.length &&
                    queuenum > 0
                ) {
                    serverQueue.songs.splice(queuenum, 1);
                } else {
                    message.channel.send("You have to enter a valid integer!");
                }
            });
        }
	},
};