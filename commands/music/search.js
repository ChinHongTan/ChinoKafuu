module.exports = {
    name: "search",
    guildOnly: true,
    description: "Search for a keyword on YouTube.",
    execute(message) {
        let play = require("./play");
        const prefix =
            process.env.PREFIX || require("../../config/config.json").prefix;

        const ytsr = require("ytsr");
        const Discord = require("discord.js");
        const DynamicEmbed = require("../../functions/dynamicEmbed");
        let dynamicEmbed = new DynamicEmbed();

        /**
         * Creates a discord embed message
         * @param {object} item - Youtube video information
         * @param {number} page - Total number of videos
         * @returns {object} Discord embed
         */
        function createEmbed(item) {
            let embed = new Discord.MessageEmbed()
                .setURL(item.url)
                .setTitle(item.title)
                .setDescription(item.description)
                .setColor("#ff0000")
                .setImage(item.bestThumbnail.url)
                .addField("Views", item.views)
                .addField("Duration", item.duration)
                .addField("Uploaded at", item.uploadedAt)
                .setFooter(
                    `${item.author.name}\nPage${item.page + 1}/${item.total}`,
                    item.author.bestAvatar.url
                );
            return embed;
        }

        function collectorFunc() {
            message.content = `${prefix}play ${item[page].url}`;
            const args = message.content
                .slice(prefix.length)
                .trim()
                .split(/ +/);
            play.execute(message, args);
        }

        /**
         * Search for youtube videos based on keyword
         * @param {string} message - keyword to be searched for
         */
        async function search(message) {
            let keyword = message.content.substr(
                message.content.indexOf(" ") + 1
            );
            message.channel.send(`Searching ${keyword}...`);
            const filters1 = await ytsr.getFilters(keyword);
            const filter1 = filters1.get("Type").get("Video");
            const searchResults = await ytsr(filter1.url, {
                gl: "TW",
                hl: "zh-Hant",
                limit: 10,
            });
            let item = searchResults.items;
            if (item.length < 1) {
                message.channel.send(`No video was found for ${keyword}!`);
            }
            dynamicEmbed.createEmbedFlip(message, item, ["⬅️", "➡️", "▶️"], createEmbed, collectorFunc);
        }
        search(message);
    },
};
