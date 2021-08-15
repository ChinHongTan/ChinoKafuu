module.exports = {
    name: "anime",
    guildOnly: true,
    description: true,
    async execute(message, args, language) {
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
                .setDescription(language.similarity.replace("${similarity * 100}", similarity * 100))
                .setColor("#008000")
                .setImage(response.image)
                .addFields(
                    { name: language.sourceURL, value: sourceURL },
                    { name: language.nativeTitle, value: nativeTitle },
                    { name: language.romajiTitle, value: romajiTitle },
                    { name: language.englishTitle, value: englishTitle },
                    { name: language.episode, value: episode },
                    { name: language.NSFW, value: nsfw }
                )
                .setFooter(`page ${response.page + 1}/${response.total}`);
            return embed;
        }

        if (args.length > 0) {
            if (!isValidHttpUrl(args[0])) {
                return message.channel.send(language.invalidURL);
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
            return message.channel.send(language.noImage);
        }
        let e = await fetch(`https://api.trace.moe/search?cutBorders&anilistInfo&url=${encodeURIComponent(searchImage)}`);
        let response = await e.json();
        return dynamicEmbed.createEmbedFlip(message, response.result, ["⬅️", "➡️"], createEmbed);
    },
};
