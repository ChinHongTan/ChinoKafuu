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

        /**
         * Generates a discord embed
         * @param {object} response - Response object from sauceNao API call
         * @param {number} page - Which picture from the response to be displayed.
         * @returns {object} Discord embed.
         */
        function createEmbed(response, page) {
            let sourceURL = response[page].url;
            let info = "";
            for (const [key, value] of Object.entries(
                response[page].raw.data
            )) {
                if (key === "ext_urls") continue;
                info += `\`${key} : ${value}\`\n`;
            }
            let embed = new Discord.MessageEmbed()
                .setTitle(response[page].site)
                .setDescription(`Similarity: ${response[page].similarity}%`)
                .setColor("#008000")
                .setImage(response[page].thumbnail)
                .addFields(
                    { name: "**Source URL**", value: sourceURL },
                    { name: "Additional info", value: info }
                )
                .setFooter(`page ${page + 1}/${response.length}`);
            return embed;
        }

        /**
         * Generates a discord embed
         * @param {object} response - Response object from ascii2d API call
         * @param {number} page - Which picture from the response to be displayed.
         * @returns {object} Discord embed.
         */
        function createEmbed2(response, page) {
            let sourceURL = response[page].source.url;
            let title = response[page].source.title;
            let author = "No info found!";
            if (response[page].source.author) {
                let authorinfo = response[page].source.author;
                author = `Name: ${authorinfo.name}\nLink: ${authorinfo.url}`;
            }
            let embed = new Discord.MessageEmbed()
                .setTitle(response[page].source.type)
                .setColor("#008000")
                .setImage(response[page].thumbnailUrl)
                .addFields(
                    { name: "**Source URL**", value: sourceURL },
                    { name: "Title", value: title },
                    { name: "Author", author }
                )
                .setFooter(`page ${page + 1}/${response.length}`);
            return embed;
        }

        /**
         * Actions after a user had reacted
         * @param {object} r - Reaction from the user
         * @param {number} page - Which picture in the response to display
         * @param {object} response - The response object from the API call
         * @param {object} embedMessage - Message to be edited
         * @param {function} embedFunc - Function to create embedMessage
         * @returns {number} Page
         */
        function reactHandler(r, page, response, embedMessage, embedFunc) {
            let editedEmbed;
            switch (r.emoji.name) {
                case "⬅️":
                    page -= 1;
                    if (page < 0) page = response.length - 1;
                    editedEmbed = embedFunc(response, page);
                    embedMessage.edit(editedEmbed);
                    break;
                case "➡️":
                    page += 1;
                    if (page + 1 > response.length) page = 0;
                    editedEmbed = embedFunc(response, page);
                    embedMessage.edit(editedEmbed);
                    break;
            }
            return page;
        }

        /**
         * Updates an embed
         * @param {number} page - Which picture in the response to display.
         * @param {object} response - The response object from the API call.
         * @param {object} embedMessage - Discord embed message object
         * @param {object} collector - Discord collector object
         * @param {function} func - Function to create embedMessage
         */
        function updateEmbed(page, response, embedMessage, collector, func) {
            collector.on("collect", (r) => {
                page = reactHandler(
                    r,
                    page,
                    response,
                    embedMessage,
                    func
                );
            });
            collector.on("remove", (r) => {
                page = reactHandler(
                    r,
                    page,
                    response,
                    embedMessage,
                    func
                );
            });
        }

        /**
         * Function to send embed message
         * @param {object} embed - Discord embed object
         * @param {object} response - Response object from the API call
         * @param {number} page - Which picture from the response to be displayed.
         * @param {number} mode - Which API to use (whether sauceNao or ascii2d)
         */
        function sendEmbed(embed, response, page = 0, mode) {
            message.channel.send(embed).then((embedMessage) => {
                embedMessage.react("⬅️").then(embedMessage.react("➡️"));
                const filter = (reaction, user) =>
                    ["⬅️", "➡️"].includes(reaction.emoji.name) && !user.bot;
                const collector = embedMessage.createReactionCollector(filter, {
                    idle: 60000,
                    dispose: true,
                });
                switch (mode) {
                    case 1:
                        updateEmbed(page, response, embedMessage, collector, createEmbed);
                        break;
                    case 2:
                        updateEmbed(page, response, embedMessage, collector, createEmbed2);
                }
            });
        }

        /**
         * Search for an image from sauceNao or ascii2d
         * @param {string} searchImage - url of the target image to search for.
         */
        function searchForImage(searchImage) {
            let page = 0;
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
                            let embed = createEmbed2(response2, page);
                            mode = 2;
                            sendEmbed(embed, response2, page, mode);
                        });
                    } else {
                        let embed = createEmbed(response, page);
                        sendEmbed(embed, response, page, mode);
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
