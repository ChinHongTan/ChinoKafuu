const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const commandReply = new CommandReply();
const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');
const DynamicEmbed = require('../../functions/dynamicEmbed');
const dynamicEmbed = new DynamicEmbed();
async function anime(command, args, language) {
    function isValidHttpUrl(string) {
        let url;

        try {
            url = new URL(string);
        } catch (_) {
            return false;
        }

        return url.protocol === 'http:' || url.protocol === 'https:';
    }

    function createEmbed(response) {
        return new MessageEmbed()
            .setTitle(response.anilist.title.native)
            .setDescription(language.similarity.replace('${similarity * 100}', response.similarity * 100))
            .setColor('#008000')
            .setImage(response.image)
            .addField(language.sourceURL, response.video)
            .addField(language.nativeTitle, response.anilist.title.native)
            .addField(language.romajiTitle, response.anilist.title.romaji)
            .addField(language.englishTitle, response.anilist.title.english)
            .addField(language.episode, response.episode.toString())
            .addField(language.NSFW, response.anilist.isAdult.toString());
    }

    if (args[0]) {
        if (!isValidHttpUrl(args[0])) {
            return commandReply.reply(command, language.invalidURL, 'RED');
        }
        const e = await fetch(`https://api.trace.moe/search?cutBorders&anilistInfo&url=${encodeURIComponent(args[0])}`);
        const response = await e.json();
        return dynamicEmbed.createEmbedFlip(command, response.result, ['⬅️', '➡️'], createEmbed);
    }
    let searchImage;
    const messages = await command.channel.messages.fetch({ limit: 25 });
    for (const msg of messages.values()) {
        if (msg.attachments.size > 0) {
            searchImage = msg.attachments.first().proxyURL;
            break;
        }
    }
    if (!searchImage) {
        return commandReply.reply(command, language.noImage, 'RED');
    }
    const e = await fetch(`https://api.trace.moe/search?cutBorders&anilistInfo&url=${encodeURIComponent(searchImage)}`);
    const response = await e.json();
    return dynamicEmbed.createEmbedFlip(command, response.result, ['⬅️', '➡️'], createEmbed);
}
module.exports = {
    name: 'anime',
    guildOnly: true,
    description: true,
    async execute(message, args, language) {
        await anime(message, args, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder()
            .addStringOption((option) => option.setName('url').setDescription('Enter image url')),
        async execute(interaction, language) {
            await anime(interaction, [interaction.options.getString('url')], language);
        },
    },
};
