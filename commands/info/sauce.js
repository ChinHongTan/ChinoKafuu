module.exports = {
    name: "sauce",
    description: "Search SauceNao for an image source.",
    cooldown: 5,
    async execute(message, args) {
        const Discord = require("discord.js");
        const sagiriToken =
            process.env.SAGIRI || require("../../config/config.json").sagiri_token;
        const sagiri = require("sagiri");
        let mySauce = sagiri(sagiriToken);
        const { searchByUrl } = require("ascii2d");
        const DynamicEmbed = require("../../functions/dynamicEmbed");
        let dynamicEmbed = new DynamicEmbed();

        /**
         * Generates a discord embed
         * @param {object} response - Response object from sauceNao API call
         * @param {number} page - Which picture from the response to be displayed.
         * @returns {object} Discord embed.
         */
        function createEmbed(response) {
            let sourceURL = response.url;
            let info = "";
            for (const [key, value] of Object.entries(
                response.raw.data
            )) {
                if (key === "ext_urls") continue;
                info += `\`${key} : ${value}\`\n`;
            }
            let embed = new Discord.MessageEmbed()
                .setTitle(response.site)
                .setDescription(`Similarity: ${response.similarity}%`)
                .setColor("#008000")
                .setImage(response.thumbnail)
                .addFields(
                    { name: "**Source URL**", value: sourceURL },
                    { name: "Additional info", value: info }
                )
                .setFooter(`page ${response.page + 1}/${response.total}`);
            return embed;
        }

        /**
         * Generates a discord embed
         * @param {object} response - Response object from ascii2d API call
         * @returns {object} Discord embed.
         */
        function createEmbed2(response) {
            let sourceURL = response.source.url;
            let title = response.source.title;
            let author = "No info found!";
            if (response.source.author) {
                let authorinfo = response.source.author;
                author = `Name: ${authorinfo.name}\nLink: ${authorinfo.url}`;
            }
            let embed = new Discord.MessageEmbed()
                .setTitle(response.source.type)
                .setColor("#008000")
                .setImage(response.thumbnailUrl)
                .addFields(
                    { name: "**Source URL**", value: sourceURL },
                    { name: "Title", value: title },
                    { name: "Author", author }
                )
                .setFooter(`page ${response.page + 1}/${response.total}`);
            return embed;
        }

        /**
         * Function to send embed message
         * @param {object} response - Response object from the API call
         * @param {number} mode - Which API to use (whether sauceNao or ascii2d)
         */
        function sendEmbed(response, mode) {
            switch (mode) {
                case 1:
                    // saucenao
                    dynamicEmbed.createEmbedFlip(message, response, ["⬅️", "➡️"], createEmbed);
                    break;
                case 2:
                    // ascii2d
                    dynamicEmbed.createEmbedFlip(message, response, ["⬅️", "➡️"], createEmbed2);
                    break;
            }
        }

        /**
         * Search for an image from sauceNao or ascii2d
         * @param {string} searchImage - url of the target image to search for.
         */
        async function searchForImage(searchImage) {
            let mode = 1;
            // start with saucenao
            let result = await mySauce(searchImage, { results: 10 });
            let response = result.filter((r) => r.similarity > 80);

            if (response.length > 0) {
                return sendEmbed(response, mode);
            }
            // search with ascii2d
            let result2 = await searchByUrl(searchImage, "bovw");
            if (!result2 || result2.length < 1) {
                return message.channel.send("No result!");
            }
            let response2 = result2.items.filter(
                (r2) => r2.source !== 0
            );
            mode = 2;
            sendEmbed(response2, mode);
        }

        var searchImage = "";

        if (args.length > 0) {
            searchImage = args[0];
            return searchForImage(searchImage);
        }
        // no arguments were provided, fetch image from the channel instead
        let messages = await message.channel.messages.fetch({ limit: 25 });
        for (const msg of messages.values()) {
            if (msg.attachments.size > 0) {
                searchImage = msg.attachments.first().proxyURL;
                break;
            }
        }
        if (!searchImage) {
            return message.channel.send(
                "You have to upload an image before using this command!"
            );
        }
        searchForImage(searchImage);
    },
};
