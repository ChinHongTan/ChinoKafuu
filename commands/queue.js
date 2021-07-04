module.exports = {
	name: 'queue',
	guildOnly: true,
    musicCommand: true,
	description: 'Check the current song queue.',
	execute(message, args, serverQueue, queue) {
		if (message.channel.type === "dm"){
            message.channel.send(
                "I can't execute that command inside DMs!"
            );
            return [serverQueue, queue];
        }
        if (serverQueue) {
            var songQueue = serverQueue.songs.slice(1);
            var printQueue = "";
            songQueue.forEach((item, index) => {
                var songNo = index + 1;
                var songTitle = item.title;
                var songURL = item.url;
                var songLength = item.length;
                var queueString = `${songNo}.[${songTitle}](${songURL}) | ${format(
                    songLength
                )}\n\n`;
                printQueue += queueString;
            });
            let embed = new Discord.MessageEmbed()
                .setColor("#ff0000")
                .setTitle("Song Queue")
                .setDescription(
                    `**Now playing**\n[${serverQueue.songs[0].title}](${serverQueue.songs[0].url})\n\n**Queued Songs**\n${printQueue}${serverQueue.songs.length} songs in queue`
                );
            message.channel.send(embed);
            return [serverQueue, queue];
        } else {
            message.channel.send("There is no song in the queue!");
            return [serverQueue, queue];
        }
	},
};