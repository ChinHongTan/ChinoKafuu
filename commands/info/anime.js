module.exports = {
    name: "anime",
    guildOnly: true,
    description: "Search for anime details or search anime with frames.",
    async execute(message, args) {
        const fetch = require("node-fetch");
        const Discord = require("discord.js");
        const DynamicEmbed = require("../../functions/dynamicEmbed");
        let dynamicEmbed = new DynamicEmbed();

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
                .setImage(response.image)
                .addFields(
                    { name: "**Source URL**", value: sourceURL },
                    { name: "Native Title", value: nativeTitle },
                    { name: "Romaji Title", value: romajiTitle },
                    { name: "englishTitle", value: englishTitle },
                    { name: "Episode", value: episode },
                    { name: "NSFW", value: nsfw }
                )
                .setFooter(`page ${response.page + 1}/${response.total}`);
            return embed;
        }

        if (args.length > 0) {
            if (!isValidHttpUrl(args[0])) {
                return message.channel.send("Please enter a valid http url!");
            }
            let e = await fetch(`https://api.trace.moe/search?cutBorders&anilistInfo&url=${encodeURIComponent(args[0])}`);
            let response = await e.json();
            return dynamicEmbed.createEmbedFlip(message, response.result, ["⬅️", "➡️"], createEmbed);
        }
        let searchImage;
        let messages = await message.channel.messages.fetch({ limit: 25 });
        for (const msg of messages.values()) {
            if (msg.attachments.size > 0) {
                searchImage = msg.attachments.first().proxyURL;
                break;
            }
        }
        if (!searchImage) {
            return message.channel.send("You have to upload an image before using this command!");
        }
        let e = await fetch(`https://api.trace.moe/search?cutBorders&anilistInfo&url=${encodeURIComponent(searchImage)}`);
        let response = await e.json();
        return dynamicEmbed.createEmbedFlip(message, response.result, ["⬅️", "➡️"], createEmbed);
    },
};
