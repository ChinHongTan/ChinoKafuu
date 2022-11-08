const { SlashCommandBuilder } = require('@discordjs/builders');
const { error } = require('../../functions/Util.js');
const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');
const Paginator = require('../../functions/paginator');

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
            .setDescription(language.similarity.replace('${similarity}', response.similarity * 100))
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
        const embedList = [];
        for (const responseObject of response.result) {
            embedList.push(createEmbed(responseObject));
        }
        const paginator = new Paginator(embedList, command);
        const message = paginator.render();
        const collector = message.createMessageComponentCollector({
            filter: ({ customId, user }) =>
                ['button1', 'button2', 'button3', 'button4'].includes(customId) && user.id === command.member.id,
            idle: 60000,
        });
        collector.on('collect', async (button) => {
            await paginator.paginate(button, 0);
        });
        collector.on('end', async (button) => {
            if (!button.first()) {
                message.channel.send(language.timeout);
                await message.delete();
            }
        });
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
    const embedList = [];
    for (const responseObject of response.result) {
        embedList.push(createEmbed(responseObject));
    }
    const paginator = new Paginator(embedList, command);
    const message = paginator.render();
    const collector = message.createMessageComponentCollector({
        filter: ({ customId, user }) =>
            ['button1', 'button2', 'button3', 'button4'].includes(customId) && user.id === command.member.id,
        idle: 60000,
    });
    collector.on('collect', async (button) => {
        await paginator.paginate(button, 0);
    });
    collector.on('end', async (button) => {
        if (!button.first()) {
            message.channel.send(language.timeout);
            await message.delete();
        }
    });
}
module.exports = {
    name: 'anime',
    guildOnly: true,
    data: new SlashCommandBuilder()
        .setName('anime')
        .setDescription('根據動漫截圖查找動漫/查詢動漫相關信息')
        .setDescriptionLocalizations({
            'en-US': 'Search for anime details or search anime with frames.',
            'zh-CN': '根据动漫截图查找动漫/查询动漫相关信息',
            'zh-TW': '根據動漫截圖查找動漫/查詢動漫相關信息',
        })
        .addStringOption((option) => option
            .setName('url')
            .setNameLocalizations({
                'en-US': 'url',
                'zh-CN': '网址',
                'zh-TW': '網址',
            })
            .setDescription('輸入圖片網址，如果沒有網址將會搜索最後在頻道里上傳圖片')
            .setDescriptionLocalizations({
                'en-US': 'URL of image, will search the last attachment uploaded in the channel if no url was given',
                'zh-CN': '输入图片网址，如果没有网址将会搜索最后在频道里上传图片',
                'zh-TW': '輸入圖片網址，如果沒有網址將會搜索最後在頻道里上傳圖片',
            }),
        ),
    async execute(interaction, language) {
        await anime(interaction, [interaction.options.getString('url')], language);
    },
};
