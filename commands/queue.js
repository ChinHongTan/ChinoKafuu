module.exports = {
	name: 'queue',
	guildOnly: true,
    aliases: ['q'],
	description: 'Check the current song queue.',
	execute(message) {
        const queueData = require("../data/queueData");
        let queue = queueData.queue;
        let serverQueue = queue.get(message.guild.id);
        const Discord = require('discord.js');

        function format(duration) {
            // Hours, minutes and seconds
            var hrs = ~~(duration / 3600);
            var mins = ~~((duration % 3600) / 60);
            var secs = ~~duration % 60;
        
            // Output like "1:01" or "4:03:59" or "123:03:59"
            var ret = "";
        
            if (hrs > 0) {
                ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
            }
        
            ret += "" + mins + ":" + (secs < 10 ? "0" : "");
            ret += "" + secs;
            return ret;
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
            return message.channel.send(embed);
        } else {
            return message.channel.send("There is no song in the queue!");
        }
	},
};