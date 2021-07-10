module.exports = {
    name: "sauce",
    description: "Search SauceNao for an image source.",
    cooldown: 5,
    execute(message, args) {
        const Discord = require("discord.js");
        const sagiri_token = process.env.SAGIRI || require("../config/config.json").sagiri_token;
        const sagiri = require("sagiri");
        let mySauce = sagiri(sagiri_token);
        const { searchByUrl } = require("ascii2d");

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

        function reactHandler(r, page, response, embedMessage, embedFunc) {
            switch (r.emoji.name) {
                case "⬅️":
                    page -= 1;
                    if (page < 0) page = response.length - 1;
                    let editedEmbed = embedFunc(response, page);
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
                        collector.on("collect", (r) => {
                            page = reactHandler(
                                r,
                                page,
                                response,
                                embedMessage,
                                createEmbed(response, page)
                            );
                        });
                        collector.on("remove", (r) => {
                            page = reactHandler(
                                r,
                                page,
                                response,
                                embedMessage,
                                createEmbed(response, page)
                            );
                        });
                        break;
                    case 2:
                        collector.on("collect", (r) => {
                            page = reactHandler(
                                r,
                                page,
                                response,
                                embedMessage,
                                createEmbed2(response, page)
                            );
                        });
                        collector.on("remove", (r) => {
                            page = reactHandler2(
                                r,
                                page,
                                response,
                                embedMessage,
                                createEmbed2(response, page)
                            );
                        });
                }
            });
        }

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
