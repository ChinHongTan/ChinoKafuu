module.exports = {
    name: "nhentai",
    cooldown: 10,
    description: "Search for a doujin on nhentai.",
    execute(message, args) {
        const nhentai = require("nhentai-js");
        const Discord = require("discord.js");
        const NanaApi = require("nana-api");
        const nana = new NanaApi();
        const DynamicEmbed = require("../../functions/dynamicEmbed");
        let dynamicEmbed = new DynamicEmbed();

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
        function createSearchEmbed(result) {
            let embed = new Discord.MessageEmbed()
                .setTitle(result.title)
                .setDescription(
                    `Book Id: ${result.id}\nLanguage: ${result.language}`
                )
                .setColor("#ff0000")
                .setImage(result.thumbnail.s)
                .setFooter("⬅️: Back, ➡️: Forward, ▶️: Read the book");
            return embed;
        }

        /**
         * An embed with the doujin object.
         * @param {array} pages - The list of pages of the doujin.
         * @param {number} page - The page number of the doujin being displayed.
         * @returns {object} Discord embed.
         */
        function createBookEmbed(pages) {
            let embed = new Discord.MessageEmbed()
                .setImage(pages)
                .setFooter("⬅️: Back, ➡️: Forward");
            return embed;
        }

        /**
         * Generate and display an reactable message of a doujin. React with emojis to change the message content.
         * @param {object} doujin - The doujin to be displayed.
         * @param {array} doujin.pages - The list of pages of the doujin.
         * @param {number} [page = 0] - The page number of the doujin being displayed.
         */
        function generateContent(doujin) {
            dynamicEmbed.createEmbedFlip(message, doujin.pages, ["⬅️", "➡️"], createBookEmbed);
        }

        /**
         * Generate and display an reactable message of a doujin cover. React with emojis to change the message content.
         * @param {object} result - The result from the search. Consist of an array of doujins.
         * @param {array} result.results - An array of doujins.
         * @param {number} page - The position of displayed doujin in the array.
         */
        function generateDoujin(result, page) {
            nhentai.getDoujin(result.results[page].id).then((doujin) => {
                dynamicEmbed.createEmbedFlip(message, [doujin], ["▶️"], createDoujinEmbed, generateContent, [doujin]);
            });
        }

        (async () => {
            // if an id is provided
            if (Number(args[0])) {
                if (nhentai.exists(args[0])) {
                    const doujin = await nhentai.getDoujin(args[0]);
                    dynamicEmbed.createEmbedFlip(message, [doujin], ["▶️"], createDoujinEmbed, generateContent, [doujin]);
                } else {
                    return message.channel.send("The book ID doesn't exist!");
                }
            } else {
                // search the keyword given
                const result = await nana.search(
                    message.content.substr(message.content.indexOf(" "))
                );
                let page = 0;
                dynamicEmbed.createEmbedFlip(message, result.results, ["⬅️", "➡️", "▶️"], createSearchEmbed, generateDoujin, [result, page])
            }
        })();
    },
};
