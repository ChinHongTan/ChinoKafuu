module.exports = {
    name: "queue",
    guildOnly: true,
    aliases: ["q"],
    description: "Check the current song queue.",
    execute(message) {
        const queueData = require("../../data/queueData");
        let queue = queueData.queue;
        let serverQueue = queue.get(message.guild.id);
        const { format } = require("../../functions/musicFunctions");
        const Discord = require("discord.js");
        const DynamicEmbed = require("../../functions/dynamicEmbed");
        let dynamicEmbed = new DynamicEmbed();
        const array_chunks = (array, chunkSize) => Array(Math.ceil(array.length / chunkSize)).fill().map((_, index) => index * chunkSize).map(begin => array.slice(begin, begin + chunkSize));

        /**
         * Create an Discord embed message
         * @param {object} result - The result from the API.
         * @returns {object} Discord embed
         */
         function createEmbed(smallChunk) {
            let printQueue = "";
            smallChunk.forEach((item) => {
                var songNo = item.index;
                var songTitle = item.title;
                var songURL = item.url;
                var songLength = item.duration;
                var queueString = `${songNo}.[${songTitle}](${songURL}) | ${format(songLength)}\n\n`;
                printQueue += queueString;
            });
            let embed = new Discord.MessageEmbed()
                .setColor("#ff0000")
                .setTitle("Song Queue")
                .setDescription(`**Now playing**\n[${serverQueue.songs[0].title}](${serverQueue.songs[0].url})\n\n**Queued Songs**\n${printQueue}${serverQueue.songs.length - 1} songs in queue`);
            return embed;
        }


        if (serverQueue) {
            var songQueue = serverQueue.songs.slice(1);
            songQueue.forEach((item, index) => {
                item.index = index + 1;
            })
            let arrayChunk = array_chunks(songQueue, 10);
            if (songQueue.length > 10) {
                dynamicEmbed.createEmbedFlip(message, arrayChunk, ["⬅️", "➡️"], createEmbed);
            } else {
                let embed = createEmbed(songQueue);
                return message.channel.send(embed);
            }
        } else {
            return message.channel.send("There is no song in the queue!");
        }
    },
};
