const { error, info } = require('../../functions/Util.js');
const { MessageEmbed } = require('discord.js');
const { searchByUrl } = require('../../functions/ascii2d.js');
const sagiriToken = process.env.SAGIRI || require('../../config/config.json').sagiri_token;
const sagiri = require('sagiri');
let mySauce;
if (sagiriToken) mySauce = sagiri(sagiriToken);
const DynamicEmbed = require('../../functions/dynamicEmbed');
const { SlashCommandBuilder } = require('@discordjs/builders');
const dynamicEmbed = new DynamicEmbed();

async function sauce(command, args, language) {
    /**
     * Generates a discord embed
     * @param {object} response - Response object from sauceNao API call
     * @return {MessageEmbed} Discord embed.
     */
    function createEmbed(response) {
        const sourceURL = response.url;
        let information = '';
        for (const [key, value] of Object.entries(response.raw.data)) {
            if (key === 'ext_urls') continue;
            information += `\`${key} : ${value}\`\n`;
        }
        // .setFooter(`page ${response.page + 1}/${response.total}`);
        return new MessageEmbed()
            .setTitle(response.site)
            .setDescription(language.similarity.replace('${similarity}', response.similarity))
            .setColor('#008000')
            .setImage(response.thumbnail)
            .addFields(
                { name: language.sourceURL, value: sourceURL },
                { name: language.additionalInfo, value: information },
            );
    }

    /**
     * Generates a discord embed
     * @param {object} response - Response object from ascii2d API call
     * @return {MessageEmbed} Discord embed.
     */
    function createEmbed2(response) {
        const sourceURL = response?.source?.url ?? 'None';
        const title = response?.source?.title ?? 'None';
        const author = response?.source?.author ? language.sauceAuthor.replace('${authorInfo.name}', response?.source?.author.name).replace('${authorInfo.url}', response?.source?.author.url) : language.noAuthor;
        // .setFooter(`page ${response.page + 1}/${response.total}`);
        return new MessageEmbed()
            .setTitle(response?.source?.type ?? 'None')
            .setColor('#008000')
            .setImage(response.thumbnailUrl)
            .addFields(
                { name: language.sourceURL, value: sourceURL },
                { name: language.title, value: title },
                { name: language.author, value: author },
            );
    }

    /**
     * Function to send embed message
     * @param {object} response - Response object from the API call
     * @param {number} mode - Which API to use (whether sauceNao or ascii2d)
     */
    function sendEmbed(response, mode) {
        switch (mode) {
        case 1:
            // saucenao
            dynamicEmbed.createEmbedFlip(command, response, ['⬅️', '➡️'], createEmbed);
            break;
        case 2:
            // ascii2d
            dynamicEmbed.createEmbedFlip(command, response, ['⬅️', '➡️'], createEmbed2);
            break;
        }
    }

    /**
     * Search for an image from sauceNao or ascii2d
     * @param {string} searchImage - url of the target image to search for.
     */
    async function searchForImage(searchImage) {
        let mode = 1;
        // start with saucenao
        const result = await mySauce(searchImage, { results: 10 });
        const response = result.filter((r) => r.similarity > 80);

        if (response.length > 0) {
            return sendEmbed(response, mode);
        }
        // search with ascii2d
        const result2 = await searchByUrl(searchImage, 'bovw');
        if (!result2.items || result2.items.length < 1) {
            return error(command, language.noResult);
        }
        // const response2 = result2.items.filter((r2) => r2.source !== 0);
        mode = 2;
        // sendEmbed(response2, mode);
        sendEmbed(result2.items, mode);
    }

    let searchImage = '';

    if (args[0]) {
        searchImage = args[0];
        return searchForImage(searchImage);
    }
    // no arguments were provided, fetch image from the channel instead
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
    await info(command, language.searchingSauce);
    await searchForImage(searchImage);
}

module.exports = {
    name: 'sauce',
    data: new SlashCommandBuilder()
        .setName('sauce')
        .setDescription('在SauceNao/Ascii2d網站上搜索圖源')
        .setDescriptionLocalizations({
            'en-US': 'Search SauceNao/Ascii2d for an image source.',
            'zh-CN': '在SauceNao/Ascii2d网站上搜索图源',
            'zh-TW': '在SauceNao/Ascii2d網站上搜索圖源',
        })
        .addStringOption((option) => option
            .setName('url')
            .setDescription('要查詢的圖片的網址，如果沒有提供網址將會搜索最後在頻道里上傳的圖片')
            .setDescriptionLocalizations({
                'en-US': 'URL of image, will search the last attachment uploaded in the channel if no url was given',
                'zh-CN': '要查询的图片的网址，如果没有提供网址将会搜索最后在频道里上传的图片',
                'zh-TW': '要查詢的圖片的網址，如果沒有提供網址將會搜索最後在頻道里上傳的圖片',
            }),
        ),
    coolDown: 5,
    async execute(interaction, language) {
        if (!sagiriToken) return interaction.reply('This command can\'t be used without SauceNAO token!');
        await sauce(interaction, [interaction.options.getString('url')], language);
    },
};
