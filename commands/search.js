module.exports = {
	name: 'search',
	guildOnly: true,
	description: 'Search for a keyword on YouTube.',
	execute(message) {
        let play = require("./play");
        const { prefix } = require("../config/config.json");

        const ytsr = require("ytsr");
        const Discord = require('discord.js');

        function createEmbed(item, page) {
            let embed = new Discord.MessageEmbed()
                .setURL(item[page].url)
                .setTitle(item[page].title)
                .setDescription(item[page].description)
                .setColor("#ff0000")
                .setImage(item[page].bestThumbnail.url)
                .addField("Views", item[page].views)
                .addField("Duration", item[page].duration)
                .addField("Uploaded at", item[page].uploadedAt)
                .setFooter(
                    `${item[page].author.name}\nPage${page + 1}/${item.length}`,
                    item[page].author.bestAvatar.url
                );
            return embed;
        }
        
        async function search(message){
            var keyword = message.content.substr(message.content.indexOf(" ") + 1);
            message.channel.send(`Searching ${keyword}...`);
            const filters1 = await ytsr.getFilters(keyword);
            const filter1 = filters1.get("Type").get("Video");
            const searchResults = await ytsr(filter1.url, {
                gl: "TW",
                hl: "zh-Hant",
                limit: 10,
            });
            var item = searchResults.items;
            var page = 0;
            if (item.length < 1){
                message.channel.send(`No video was found for ${keyword}!`);
            }
            var embed = createEmbed(item, page);

            message.channel.send(embed).then((embedMessage) => {
                embedMessage
                    .react("⬅️")
                    .then(embedMessage.react("➡️"))
                    .then(embedMessage.react("▶️"));
                const filter = (reaction, user) =>
                    ["⬅️", "➡️", "▶️"].includes(reaction.emoji.name) && !user.bot;
                const collector = embedMessage.createReactionCollector(filter, {
                    idle: 12000,
                    dispose: true,
                });
                collector.on("collect", (r) => {
                    if (r.emoji.name === "⬅️") {
                        page -= 1;
                        if (page < 0) page = item.length - 1;
                        var editedEmbed = createEmbed(item, page);
                        embedMessage.edit(editedEmbed);
                    } else if (r.emoji.name === "➡️") {
                        page += 1;
                        if (page + 1 > item.length) page = 0;
                        var editedEmbed = createEmbed(item, page);
                        embedMessage.edit(editedEmbed);
                    } else if (r.emoji.name === "▶️") {
                        collector.stop();
                        message.content = `${prefix || process.env.PREFIX}play ${item[page].url}`;
                        const args = message.content.slice(prefix.length || process.env.PREFIX.length).trim().split(/ +/);
                        play.execute(message, args);
                        embedMessage.delete();
                    }
                });
                collector.on("remove", (r) => {
                    if (r.emoji.name === "⬅️") {
                        page -= 1;
                        if (page < 0) page = item.length - 1;
                        var editedEmbed = createEmbed(item, page);
                        embedMessage.edit(editedEmbed);
                    } else if (r.emoji.name === "➡️") {
                        page += 1;
                        if (page + 1 > item.length) page = 0;
                        var editedEmbed = createEmbed(item, page);
                        embedMessage.edit(editedEmbed);
                    }
                });
            });
        }
        search(message);
	},
};