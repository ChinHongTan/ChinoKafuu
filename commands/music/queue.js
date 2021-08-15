module.exports = {
    name: "queue",
    guildOnly: true,
    aliases: ["q"],
    description: true,
    execute(message, _args, language) {
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
             let arr = smallChunk.map((item) => {
                 return `${item.index}.[${item.title}](${item.url}) | ${format(item.duration)}`
             });
            let printQueue = arr.join("\n\n");
            let embed = new Discord.MessageEmbed()
                .setColor("#ff0000")
                .setTitle(language.queueTitle)
                .setDescription(language.queueBody.replace("${serverQueue.songs[0].title}", serverQueue.songs[0].title).replace("${serverQueue.songs[0].url}", serverQueue.songs[0].url).replace("${printQueue}", printQueue).replace("${serverQueue.songs.length - 1}", serverQueue.songs.length - 1));
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
            return message.channel.send(language.noSong);
        }
    },
};
