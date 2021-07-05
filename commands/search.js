module.exports = {
	name: 'search',
	guildOnly: true,
    musicCommand: true,
	description: 'Search for a keyword on YouTube.',
	execute(client, message, args) {
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

		if (message.channel.type === "dm"){
            message.channel.send(
                "I can't execute that command inside DMs!"
            );
            return [serverQueue, queue];
        }
        async function search(message, serverQueue, queue){
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
                return [serverQueue, queue];
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
                        message.content = `c!play ${item[page].url}`;
                        [serverQueue, queue] = exec(message, serverQueue);
                        embedMessage.delete();
                        return [serverQueue, queue];
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
        [serverQueue, queue] = search(message, serverQueue, queue);
        return [serverQueue, queue];
	},
};