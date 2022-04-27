const { SlashCommandBuilder } = require('@discordjs/builders');
const { error } = require('../../functions/Util.js');
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
            return error(command, language.invalidURL);
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
        return error(command, language.noImage);
    }
    const e = await fetch(`https://api.trace.moe/search?cutBorders&anilistInfo&url=${encodeURIComponent(searchImage)}`);
    const response = await e.json();
    return dynamicEmbed.createEmbedFlip(command, response.result, ['⬅️', '➡️'], createEmbed);
}
module.exports = {
    name: 'anime',
    guildOnly: true,
    description: {
        'en_US': 'Search for anime details or search anime with frames.',
        'zh_CN': '根据动漫截图查找动漫/查询动漫相关信息',
        'zh_TW': '根據動漫截圖查找動漫/查詢動漫相關信息',
    },
    options: [
        {
            name: 'url',
            description: {
                'en_US': 'URL of image, will search the last attachment uploaded in the channel if no url was given',
                'zh_CN': '输入图片网址，如果没有网址将会搜索最后在频道里上传图片',
                'zh_TW': '輸入圖片網址，如果沒有網址將會搜索最後在頻道里上傳圖片',
            },
            type: 'STRING',
        },
    ],
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
