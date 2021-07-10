module.exports = {
    name: "nhentai",
    cooldown: 10,
    description: "Search for a doujin on nhentai.",
    execute(message, args) {
        const nhentai = require("nhentai-js");
        const Discord = require("discord.js");
        const nanaApi = require("nana-api");
        const nana = new nanaApi();

        function createDoujinEmbed(doujin) {
            var description = "";
            for (const [key, value] of Object.entries(doujin.details)) {
                var info = "";
                value.forEach((element) => {
                    info += `${element}  `;
                });
                description += `${key}: ${info}\n`;
            }
            let embed = new Discord.MessageEmbed()
                .setTitle(doujin.title)
                .setDescription(`${description}`)
                .setColor("#ff0000")
                .setImage(doujin.thumbnails[0])
                .addField("Link", doujin.link)
                .setFooter("▶️: Read the book");
            return embed;
        }

        function createSearchEmbed(result, page) {
            let embed = new Discord.MessageEmbed()
                .setTitle(result.results[page].title)
                .setDescription(
                    `Book Id: ${result.results[page].id}\nLanguage: ${result.results[page].language}`
                )
                .setColor("#ff0000")
                .setImage(result.results[page].thumbnail.s)
                .setFooter(
                    "⬅️: Back, ➡️: Forward, ▶️: Read the book"
                );
            return embed;
        }

        function createBookEmbed(pages, page) {
            let embed = new Discord.MessageEmbed()
                .setImage(pages[page])
                .setFooter("⬅️: Back, ➡️: Forward");
            return embed;
        }

        function generateDoujin(result, page) {
            nhentai
                .getDoujin(result.results[page].id)
                .then((doujin) => {
                    var embed = createDoujinEmbed(doujin);
                    createDoujinFlip(embed, doujin);
                });
        }

        function generateContent(doujin) {
            var page = 0;
            var embed = createBookEmbed(doujin.pages, page);
            createBookFlip(embed, doujin.pages);
        }

        function flipEmbeds(r, page, createFunc, collector, collectorFunc) {
            switch(r.emoji.name) {
                case "⬅️":
                    page -= 1;
                    if (page < 0) page = result.results.length - 1;
                    editedEmbed = createFunc(result, page);
                    embedMessage.edit(editedEmbed);
                  break;
                case "➡️":
                    page += 1;
                    if (page + 1 > result.results.length) page = 0;
                    editedEmbed = createFunc(result, page);
                    embedMessage.edit(editedEmbed);
                  break;
                case "▶️":
                    collector.stop();
                    collectorFunc(result);
                    embedMessage.delete();
                  break;
            }
        }

        function createDoujinFlip(embed, doujin) {
            message.channel.send(embed).then((embedMessage) => {
                embedMessage.react("▶️");
                const filter = (reaction, user) =>
                    ["▶️"].includes(reaction.emoji.name) && !user.bot;
                const collector = embedMessage.createReactionCollector(filter, {
                    idle: 600000,
                });
                collector.on("collect", (r) => {
                    flipEmbeds(r, page = page, collector = collector, collectorFunc = generateContent(doujin));
                });
            });
        }

        function createSearchFlip(embed, result) {
            var page = 0;
            message.channel.send(embed).then((embedMessage) => {
                embedMessage
                    .react("⬅️")
                    .then(embedMessage.react("➡️"))
                    .then(embedMessage.react("▶️"));
                const filter = (reaction, user) =>
                    ["⬅️", "➡️", "▶️"].includes(reaction.emoji.name) &&
                    !user.bot;
                const collector = embedMessage.createReactionCollector(filter, {
                    idle: 600000,
                    dispose: true,
                });
                collector.on("collect", (r) => {
                    flipEmbeds(r, page, createSearchEmbed(result, page), collector, generateDoujin(embed, page));
                });
                collector.on("remove", (r) => {
                    flipEmbeds(r, page, createSearchEmbed(result, page));
                });
            });
        }

        function createBookFlip(embed, pages) {
            var page = 0;
            message.channel.send(embed).then((embedMessage) => {
                embedMessage
                    .react("⬅️")
                    .then(embedMessage.react("➡️"));
                const filter = (reaction, user) =>
                    ["⬅️", "➡️"].includes(reaction.emoji.name) &&
                    !user.bot;
                const collector = embedMessage.createReactionCollector(filter, {
                    idle: 600000,
                    dispose: true,
                });
                collector.on("collect", (r) => {
                    flipEmbeds(r, page, createBookEmbed(pages, page));
                });
                collector.on("remove", (r) => {
                    flipEmbeds(r, page, createSearchEmbed(result, page));
                });
            });
        }

        (async () => {
            if (Number(args[0])) {
                if (nhentai.exists(args[0])) {
                    const doujin = await nhentai.getDoujin(args[0]);
                    var page = 0;
                    var embed = createDoujinEmbed(doujin);
                    createDoujinFlip(embed, doujin);
                } else {
                    return message.channel.send("The book ID doesn't exist!");
                }
            } else {
                const result = await nana.search(
                    message.content.substr(message.content.indexOf(" "))
                );
                var page = 0;
                var embed = createSearchEmbed(result, page);
                createSearchFlip(embed, result);
            }
        })();
    },
};
