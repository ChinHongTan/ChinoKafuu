module.exports = {
    name: "nhentai",
    cooldown: 10,
    description: "Search for a doujin on nhentai.",
    execute(message, args) {
        const nhentai = require("nhentai-js");
        const Discord = require("discord.js");
        const NanaApi = require("nana-api");
        const nana = new NanaApi();

        /**
         * Edit the message after user had reacted.
         * @param {Object} options - How the function should edit the message.
         * @param {object} options.r - The reaction from the user.
         * @param {number} options.page - The page number of the doujin being displayed.
         * @param {object} options.result - The result from the search.
         * @param {object} options.embedMessage - The message to be edited.
         * @param {function} options.createFunc - How the message should be edited.
         * @param {object} options.collector - The collector to detect user's reactions.
         * @param {function} options.collectorFunc - What type of reactable message to be generated.
         * @returns {number} - page
         */
        function flipEmbeds({
            r,
            page,
            result,
            embedMessage,
            createFunc,
            collector,
            collectorFunc,
        }) {
            let editedEmbed;
            let content;
            if (Array.isArray(result)) {
                content = result;
            } else {
                content = result.results;
            }
            switch (r.emoji.name) {
                case "⬅️":
                    page -= 1;
                    if (page < 0) {
                        page = content.length - 1;
                    }
                    editedEmbed = createFunc(result, page);
                    embedMessage.edit(editedEmbed);
                    break;
                case "➡️":
                    page += 1;
                    if (page + 1 > content.length) {
                        page = 0;
                    }
                    editedEmbed = createFunc(result, page);
                    embedMessage.edit(editedEmbed);
                    break;
                case "▶️":
                    collector.stop();
                    collectorFunc(result, page);
                    embedMessage.delete();
                    break;
            }
            return page;
        }

        /**
         * Generate an reactable message. React with emojis to change the message content.
         * @param {object} embed - The displayed embed message.
         * @param {object} options - How the message should be displayed and how to edit it.
         * @param {object} options.r - The reaction from the user.
         * @param {number} options.page - The page number of the doujin being displayed.
         * @param {object} options.result - The result from the search.
         * @param {object} options.embedMessage - The message to be edited.
         * @param {function} options.createFunc - How the message should be edited.
         * @param {object} options.collector - The collector to detect user's reactions.
         * @param {function} options.collectorFunc - What type of reactable message to be generated.
         * @param {array} emojiList - A list of emoji to react.
         */
        function createFlip(embed, options, emojiList) {
            message.channel.send(embed).then(async (embedMessage) => {
                for (let emoji of emojiList) {
                    await embedMessage.react(emoji);
                }
                const filter = (reaction, user) =>
                    emojiList.includes(reaction.emoji.name) && !user.bot;
                let collector = embedMessage.createReactionCollector(filter, {
                    idle: 60000,
                    dispose: true,
                });
                collector.on("collect", (r) => {
                    options.r = r;
                    options.collector = collector;
                    options.embedMessage = embedMessage;
                    options.page = flipEmbeds(options);
                });
                collector.on("remove", (r) => {
                    options.r = r;
                    options.collector = collector;
                    options.embedMessage = embedMessage;
                    options.page = flipEmbeds(options);
                });
            });
        }

        /**
         * Send an embed message with the doujin cover.
         * @param {object} doujin - The doujin contained in the embed message.
         * @param {object} doujin.details - All the details about the doujin.
         * @param {string} doujin.title - The title of the doujin.
         * @param {array} doujin.thumbnails - A list of the thumbnail images of the doujin.
         * @param {string} doujin.link - The URL of the doujin.
         * @returns {object} Discord embed.
         */
        function createDoujinEmbed(doujin) {
            let description = "";
            for (const [key, value] of Object.entries(doujin.details)) {
                let info = "";
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

        /**
         * An embed with the doujin search result.
         * @param {object} result - The result from the search. Consist of an array of doujins.
         * @param {array} result.results - An array of doujins.
         * @param {number} page - The position of displayed doujin in the array.
         * @returns {object} Discord embed.
         */
        function createSearchEmbed(result, page) {
            let embed = new Discord.MessageEmbed()
                .setTitle(result.results[page].title)
                .setDescription(
                    `Book Id: ${result.results[page].id}\nLanguage: ${result.results[page].language}`
                )
                .setColor("#ff0000")
                .setImage(result.results[page].thumbnail.s)
                .setFooter("⬅️: Back, ➡️: Forward, ▶️: Read the book");
            return embed;
        }

        /**
         * An embed with the doujin object.
         * @param {array} pages - The list of pages of the doujin.
         * @param {number} page - The page number of the doujin being displayed.
         * @returns {object} Discord embed.
         */
        function createBookEmbed(pages, page) {
            let embed = new Discord.MessageEmbed()
                .setImage(pages[page])
                .setFooter("⬅️: Back, ➡️: Forward");
            return embed;
        }

        /**
         * Generate and display an reactable message of a doujin. React with emojis to change the message content.
         * @param {object} doujin - The doujin to be displayed.
         * @param {array} doujin.pages - The list of pages of the doujin.
         * @param {number} [page = 0] - The page number of the doujin being displayed.
         */
        function generateContent(doujin, page = 0) {
            let embed = createBookEmbed(doujin.pages, page);
            let options = {
                page: page,
                result: doujin.pages,
                createFunc: createBookEmbed,
            };
            createFlip(embed, options, ["⬅️", "➡️"]);
        }

        /**
         * Generate and display an reactable message of a doujin cover. React with emojis to change the message content.
         * @param {object} result - The result from the search. Consist of an array of doujins.
         * @param {array} result.results - An array of doujins.
         * @param {number} page - The position of displayed doujin in the array.
         */
        function generateDoujin(result, page) {
            nhentai.getDoujin(result.results[page].id).then((doujin) => {
                let embed = createDoujinEmbed(doujin);
                let options = {
                    result: doujin,
                    collectorFunc: generateContent,
                };
                createFlip(embed, options, ["▶️"]);
            });
        }

        (async () => {
            // if an id is provided
            if (Number(args[0])) {
                if (nhentai.exists(args[0])) {
                    const doujin = await nhentai.getDoujin(args[0]);
                    let embed = createDoujinEmbed(doujin);
                    let options = {
                        result: doujin,
                        collectorFunc: generateContent,
                    };
                    createFlip(embed, options, ["▶️"]);
                } else {
                    return message.channel.send("The book ID doesn't exist!");
                }
            } else {
                // search the keyword given
                const result = await nana.search(
                    message.content.substr(message.content.indexOf(" "))
                );
                let page = 0;
                let embed = createSearchEmbed(result, page);
                let options = {
                    page: page,
                    result: result,
                    createFunc: createSearchEmbed,
                    collectorFunc: generateDoujin,
                };
                createFlip(embed, options, ["⬅️", "➡️", "▶️"]);
            }
        })();
    },
};
