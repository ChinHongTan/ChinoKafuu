const { SlashCommandBuilder } = require('@discordjs/builders');
const { reply } = require('../../functions/commandReply.js');
const { MessageEmbed } = require('discord.js');
const { searchByUrl } = require('../../functions/ascii2d.js');
const sagiriToken = process.env.SAGIRI || require('../../config/config.json').sagiri_token;
const sagiri = require('sagiri');
let mySauce;
if (sagiriToken) mySauce = sagiri(sagiriToken);
const DynamicEmbed = require('../../functions/dynamicEmbed');
const dynamicEmbed = new DynamicEmbed();

async function sauce(command, args, language) {
    /**
     * Generates a discord embed
     * @param {object} response - Response object from sauceNao API call
     * @return {MessageEmbed} Discord embed.
     */
    function createEmbed(response) {
        const sourceURL = response.url;
        let info = '';
        for (const [key, value] of Object.entries(response.raw.data)) {
            if (key === 'ext_urls') continue;
            info += `\`${key} : ${value}\`\n`;
        }
        // .setFooter(`page ${response.page + 1}/${response.total}`);
        return new MessageEmbed()
            .setTitle(response.site)
            .setDescription(language.similarity.replace('${similarity * 100}', response.similarity))
            .setColor('#008000')
            .setImage(response.thumbnail)
            .addFields(
                { name: language.sourceURL, value: sourceURL },
                { name: language.additionalInfo, value: info },
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
        const author = response?.source?.author ? language.sauceAuthor.replace('${authorinfo.name}', response?.source?.author.name).replace('${authorinfo.url}', response?.source?.author.url) : language.noAuthor;
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
        if (!result2 || result2.length < 1) {
            return reply(command, language.noResult, 'RED');
        }
        const response2 = result2.items.filter((r2) => r2.source !== 0);
        mode = 2;
        sendEmbed(response2, mode);
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
        return reply(command, language.noImage, 'RED');
    }
    await reply(command, language.searchingSauce, 'YELLOW');
    await searchForImage(searchImage);
}

module.exports = {
    name: 'sauce',
    description: {
        'en_US': 'Search SauceNao/Ascii2d for an image source.',
        'zh_CN': '在SauceNao/Ascii2d网站上搜索图源',
        'zh_TW': '在SauceNao/Ascii2d網站上搜索圖源',
    },
    cooldown: 5,
    async execute(message, args, language) {
        if (!sagiriToken) return message.reply('This command can\'t be used without SauceNAO token!');
        await sauce(message, args, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder()
            .addStringOption((option) =>
                option.setName('url')
                    .setDescription('URL of image you want to search for'),
            ),
        async execute(interaction, language) {
            if (!sagiriToken) return interaction.reply('This command can\'t be used without SauceNAO token!');
            await sauce(interaction, [interaction.options.getString('url')], language);
        },
    },
};
