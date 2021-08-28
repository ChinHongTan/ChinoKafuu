module.exports = {
    name: 'anime',
    guildOnly: true,
    description: true,
    async execute(message, args, language) {
        const fetch = require('node-fetch');
        const Discord = require('discord.js');
        const DynamicEmbed = require('../../functions/dynamicEmbed');
        const dynamicEmbed = new DynamicEmbed();

        function isValidHttpUrl(string) {
            let url;

            try {
                url = new URL(string);
            }
            catch (_) {
                return false;
            }

            return url.protocol === 'http:' || url.protocol === 'https:';
        }

        function createEmbed(response) {
            const sourceURL = response.video;
            const info = response.anilist;
            const nativeTitle = info.title.native;
            const romajiTitle = info.title.romaji;
            const englishTitle = info.title.english;
            const nsfw = info.isAdult;
            const { episode } = response;
            const { similarity } = response;
            const embed = new Discord.MessageEmbed()
                .setTitle(nativeTitle)
                .setDescription(language.similarity.replace('${similarity * 100}', similarity * 100))
                .setColor('#008000')
                .setImage(response.image)
                .addFields(
                    { name: language.sourceURL, value: sourceURL },
                    { name: language.nativeTitle, value: nativeTitle },
                    { name: language.romajiTitle, value: romajiTitle },
                    { name: language.englishTitle, value: englishTitle },
                    { name: language.episode, value: episode },
                    { name: language.NSFW, value: nsfw },
                )
                .setFooter(`page ${response.page + 1}/${response.total}`);
            return embed;
        }

        if (args.length > 0) {
            if (!isValidHttpUrl(args[0])) {
                return message.channel.send(language.invalidURL);
            }
            const e = await fetch(`https://api.trace.moe/search?cutBorders&anilistInfo&url=${encodeURIComponent(args[0])}`);
            const response = await e.json();
            return dynamicEmbed.createEmbedFlip(message, response.result, ['⬅️', '➡️'], createEmbed);
        }
        let searchImage;
        const messages = await message.channel.messages.fetch({ limit: 25 });
        for (const msg of messages.values()) {
            if (msg.attachments.size > 0) {
                searchImage = msg.attachments.first().proxyURL;
                break;
            }
        }
        if (!searchImage) {
            return message.channel.send(language.noImage);
        }
        const e = await fetch(`https://api.trace.moe/search?cutBorders&anilistInfo&url=${encodeURIComponent(searchImage)}`);
        const response = await e.json();
        return dynamicEmbed.createEmbedFlip(message, response.result, ['⬅️', '➡️'], createEmbed);
    },
};
