const Discord = require("discord.js");
const util = require('util');
module.exports = {
	name: 'queue',
	guildOnly: true,
    aliases: ['q'],
	description: 'Check the current song queue.',
	execute(client, message, args) {
        let serverQueue = client.queue.get(message.guild.id);
        if (serverQueue) {
            var songQueue = serverQueue.songs.slice(1);
            var printQueue = "";
            songQueue.forEach((item, index) => {
                var songNo = index + 1;
                var songTitle = item.title;
                var songURL = item.url;
                var songLength = item.duration;
                var queueString = `${songNo}.[${songTitle}](${songURL}) | ${util.format(
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
        } else {
            message.channel.send("There is no song in the queue!");
        }
	},
};