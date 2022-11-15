// This file needs some clean up

import { SlashCommandBuilder } from '@discordjs/builders';
import { error } from '../../functions/Util.js';
import * as fetch from 'node-fetch';
import { GuildMember, Message, MessageEmbed } from 'discord.js';
import Paginator = require('../../functions/paginator');
import { CustomCommandInteraction, TraceMoeResponse, TraceMoeResult, Translation } from '../../../typings/index.js';

async function anime(command: CustomCommandInteraction, args: string[], language: Translation) {
    // check if a given string is a valid URL
    function isValidHttpUrl(string: string | URL) {
        let url: URL;

        try {
            url = new URL(string);
        } catch (_) {
            return false;
        }

        return url.protocol === 'http:' || url.protocol === 'https:';
    }

    function createEmbed(response: TraceMoeResult) {
        return new MessageEmbed()
            .setTitle(response.anilist.title.native)
            .setDescription(language.similarity.replace('${similarity}', (response.similarity * 100).toString()))
            .setColor('#008000')
            .setImage(response.image)
            .addField(language.sourceURL, response.video)
            .addField(language.nativeTitle, response.anilist.title.native)
            .addField(language.romajiTitle, response.anilist.title.romaji)
            .addField(language.englishTitle, response.anilist.title.english)
            .addField(language.episode, response.episode.toString())
            .addField(language.NSFW, response.anilist.isAdult.toString());
    }
    let searchImage: string; // url of target search image
    const messages = await command.channel.messages.fetch({ limit: 25 });
    for (const msg of messages.values()) {
        if (msg.attachments.size > 0) {
            searchImage = msg.attachments.first().proxyURL;
            break;
        }
    }
    if (!searchImage) {
        if (args[0]) {
            if (!isValidHttpUrl(args[0])) return error(command, language.invalidURL);
            searchImage = args[0];
        }
        return error(command, language.noImage);
    }
    const e = await fetch(`https://api.trace.moe/search?cutBorders&anilistInfo&url=${encodeURIComponent(searchImage)}`);
    const response: TraceMoeResponse = await e.json();
    const embedList = [];
    for (const responseObject of response.result) {
        embedList.push(createEmbed(responseObject));
    }
    const paginator = new Paginator(embedList, command);
    const message = await paginator.render();
    const member = command.member;
    if (!(message instanceof Message)) return;
    if (!(member instanceof GuildMember)) return;
    const collector = message.createMessageComponentCollector({
        filter: ({ customId, user }) =>
            ['button1', 'button2', 'button3', 'button4'].includes(customId) && user.id === member.id,
        idle: 60000,
    });
    collector.on('collect', async (button) => {
        if (!button.isButton()) return;
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
    async execute(interaction: CustomCommandInteraction, language: any) {
        await anime(interaction, [interaction.options.getString('url')], language);
    },
};
