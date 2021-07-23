module.exports = {
    name: "anime",
    guildOnly: true,
    description: "Search for anime details or search anime with frames.",
    execute(message, args) {
        const fetch = require("node-fetch");
        const Discord = require("discord.js");

        function isValidHttpUrl(string) {
            let url;

            try {
                url = new URL(string);
            } catch (_) {
                return false;
            }

            return url.protocol === "http:" || url.protocol === "https:";
        }

        function createEmbed(response) {
            let sourceURL = response.video;
            let info = response.anilist;
            let nativeTitle = info.title.native;
            let romajiTitle = info.title.romaji;
            let englishTitle = info.title.english;
            let nsfw = info.isAdult;
            let episode = response.episode;
            let similarity = response.similarity;
            let embed = new Discord.MessageEmbed()
                .setTitle(nativeTitle)
                .setDescription(`Similarity: ${similarity * 100}%`)
                .setColor("#008000")
                .setImage(response.thumbnail)
                .addFields(
                    { name: "**Source URL**", value: sourceURL },
                    { name: "Native Title", value: nativeTitle },
                    { name: "Romaji Title", value: romajiTitle },
                    { name: "englishTitle", value: englishTitle },
                    { name: "Episode", value: episode },
                    { name: "NSFW", value: nsfw }
                )
                .setFooter(`page ${response.page + 1}/${response.length}`);
            return [embed, sourceURL];
        }

        function reactHandler(r, page, response, embedMessage, msg) {
            if (r.emoji.name === "⬅️") {
                page -= 1;
                if (page < 0) page = response.length - 1;
                response[page].page = page;
                let [editedEmbed, video] = createEmbed(response[page]);
                embedMessage.edit(editedEmbed);
                msg.edit(video);
            } else if (r.emoji.name === "➡️") {
                page += 1;
                if (page + 1 > response.length) page = 0;
                let [editedEmbed, video] = createEmbed(response[page]);
                embedMessage.edit(editedEmbed);
                msg.edit(video);
            }
            return page;
        }

        function sendEmbed(embed, response, video, page = 0) {
            message.channel.send(embed).then((embedMessage) => {
                message.channel.send(video).then((msg) => {
                    msg.react("⬅️").then(msg.react("➡️"));
                    const filter = (reaction, user) =>
                        ["⬅️", "➡️"].includes(reaction.emoji.name) && !user.bot;
                    const collector = msg.createReactionCollector(filter, {
                        idle: 60000,
                        dispose: true,
                    });
                    collector.on("collect", (r) => {
                        page = reactHandler(
                            r,
                            page,
                            response,
                            embedMessage,
                            msg
                        );
                    });
                    collector.on("remove", (r) => {
                        page = reactHandler(
                            r,
                            page,
                            response,
                            embedMessage,
                            msg
                        );
                    });
                });
            });
        }

        if (args.length > 0) {
            if (isValidHttpUrl(args[0])) {
                fetch(
                    `https://api.trace.moe/search?cutBorders&anilistInfo&url=${encodeURIComponent(
                        args[0]
                    )}`
                ).then((e) =>
                    e.json().then((response) => {
                        let result = response.result;
                        let [embed, video] = createEmbed(result);
                        sendEmbed(embed, result, video);
                    })
                );
                return;
            }
        } else {
            let searchImage = "";
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
                fetch(
                    `https://api.trace.moe/search?cutBorders&anilistInfo&url=${encodeURIComponent(
                        searchImage
                    )}`
                ).then((e) =>
                    e.json().then((response) => {
                        let result = response.result;
                        let [embed, video] = createEmbed(result);
                        sendEmbed(embed, result, video);
                    })
                );
                return;
            });
        }
    },
};
