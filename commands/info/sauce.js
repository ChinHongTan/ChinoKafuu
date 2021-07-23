module.exports = {
    name: "sauce",
    description: "Search SauceNao for an image source.",
    cooldown: 5,
    execute(message, args) {
        const Discord = require("discord.js");
        const sagiri_token =
            process.env.SAGIRI || require("../../config/config.json").sagiri_token;
        const sagiri = require("sagiri");
        let mySauce = sagiri(sagiri_token);
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
                    dynamicEmbed.createEmbedFlip(message, response, ["⬅️", "➡️"], createEmbed);
                    break;
                case 2:
                    dynamicEmbed.createEmbedFlip(message, response, ["⬅️", "➡️"], createEmbed2);
                    break;
            }
        }

        /**
         * Search for an image from sauceNao or ascii2d
         * @param {string} searchImage - url of the target image to search for.
         */
        function searchForImage(searchImage) {
            let mode = 1;
            mySauce(searchImage, { results: 10 })
                .then((result) => {
                    let response = result.filter((r) => r.similarity > 80);
                    console.log("request sucessful");

                    if (response.length < 1) {
                        searchByUrl(searchImage, "bovw").then((result2) => {
                            if (!result2 || result2.length < 1)
                                return message.channel.send("No result!");
                            let response2 = result2.items.filter(
                                (r2) => r2.source !== 0
                            );
                            mode = 2;
                            sendEmbed(response2, mode);
                        });
                    } else {
                        sendEmbed(response, mode);
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }

        var searchImage = "";

        if (args.length < 1) {
            // no arguments were provided, fetch image from the channel instead
            message.channel.messages.fetch({ limit: 25 }).then((messages) => {
                for (const msg of messages.values()) {
                    if (msg.attachments.size > 0) {
                        searchImage = msg.attachments.first().proxyURL;
                        break;
                    }
                }
                if (!searchImage)
                    return message.channel.send(
                        "You have to upload an image before using this command!"
                    );
                searchForImage(searchImage);
            });
        } else {
            searchImage = args[0];
            searchForImage(searchImage);
        }
    },
};
