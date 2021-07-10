module.exports = {
    name: "search",
    guildOnly: true,
    description: "Search for a keyword on YouTube.",
    execute(message) {
        let play = require("./play");
        const prefix = process.env.PREFIX || require("../config/config.json").prefix;

        const ytsr = require("ytsr");
        const Discord = require("discord.js");

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

        function flipEmbed(r) {
            switch(r.emoji.name) {
                case "⬅️":
                    page -= 1;
                    if (page < 0) page = item.length - 1;
                    let editedEmbed = createEmbed(item, page);
                    embedMessage.edit(editedEmbed);
                  break;
                case "➡️":
                    page += 1;
                    if (page + 1 > item.length) page = 0;
                    let editedEmbed = createEmbed(item, page);
                    embedMessage.edit(editedEmbed);
                  break;
                case "▶️":
                    collector.stop();
                    message.content = `${
                        prefix
                    }play ${item[page].url}`;
                    const args = message.content
                        .slice(prefix.length)
                        .trim()
                        .split(/ +/);
                    play.execute(message, args);
                    embedMessage.delete();
                  break;
            }
        }

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
            let page = 0;
            if (item.length < 1) {
                message.channel.send(`No video was found for ${keyword}!`);
            }
            var embed = createEmbed(item, page);

            message.channel.send(embed).then((embedMessage) => {
                embedMessage
                    .react("⬅️")
                    .then(embedMessage.react("➡️"))
                    .then(embedMessage.react("▶️"));
                const filter = (reaction, user) =>
                    ["⬅️", "➡️", "▶️"].includes(reaction.emoji.name) &&
                    !user.bot;
                const collector = embedMessage.createReactionCollector(filter, {
                    idle: 12000,
                    dispose: true,
                });
                collector.on("collect", (r) => {
                    flipEmbed(r);
                });
                collector.on("remove", (r) => {
                    flipEmbed(r);
                });
            });
        }
        search(message);
    },
};
