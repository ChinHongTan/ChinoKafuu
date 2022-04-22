const nhentai = require('nhentai-js');
const NanaApi = require('nana-api');
const nana = new NanaApi();
const DynamicEmbed = require('../../functions/dynamicEmbed');
const dynamicEmbed = new DynamicEmbed();
const { reply } = require('../../functions/commandReply.js');
const { MessageEmbed } = require('discord.js');

async function nhentaiFunc(command, args, language) {
    /**
     * Send an embed message with the doujin cover.
     * @param {object} doujin - The doujin contained in the embed message.
     * @param {object} doujin.details - All the details about the doujin.
     * @param {string} doujin.title - The title of the doujin.
     * @param {array} doujin.thumbnails - A list of the thumbnail images of the doujin.
     * @param {string} doujin.link - The URL of the doujin.
     * @return {object} Discord embed.
     */
    function createDoujinEmbed(doujin) {
        let description = '';
        for (const [key, value] of Object.entries(doujin.details)) {
            let info = '';
            value.forEach((element) => {
                info += `${element}  `;
            });
            description += `${key}: ${info}\n`;
        }
        return new MessageEmbed()
            .setTitle(doujin.title)
            .setDescription(`${description}`)
            .setColor('#ff0000')
            .setImage(doujin.thumbnails[0])
            .addField('Link', doujin.link)
            .setFooter({ text: '▶️: Read the book' });
    }

    /**
     * An embed with the doujin search result.
     * @param {object} result - The result from the search. Consist of an array of doujins.
     * @param {array} result.results - An array of doujins.
     * @param {number} page - The position of displayed doujin in the array.
     * @return {object} Discord embed.
     */
    function createSearchEmbed(result) {
        return new MessageEmbed()
            .setTitle(result.title)
            .setDescription(`Book Id: ${result.id}\nLanguage: ${result.language}`)
            .setColor('#ff0000')
            .setImage(result.thumbnail.s)
            .setFooter({ text: '⬅️: Back, ➡️: Forward, ▶️: Read the book' });
    }

    /**
     * An embed with the doujin object.
     * @param {array} pages - The list of pages of the doujin.
     * @param {number} page - The page number of the doujin being displayed.
     * @return {object} Discord embed.
     */
    function createBookEmbed(pages) {
        return new MessageEmbed()
            .setImage(pages)
            .setFooter({ text: '⬅️: Back, ➡️: Forward' });
    }

    /**
     * Generate and display an reactable message of a doujin. React with emojis to change the message content.
     * @param {object} doujin - The doujin to be displayed.
     * @param {array} doujin.pages - The list of pages of the doujin.
     * @param {number} [page = 0] - The page number of the doujin being displayed.
     */
    async function generateContent(doujin) {
        return await dynamicEmbed.createEmbedFlip(command, doujin.pages, ['⬅️', '➡️'], createBookEmbed);
    }

    /**
     * Generate and display an reactable message of a doujin cover. React with emojis to change the message content.
     * @param {object} result - The result from the search. Consist of an array of doujins.
     * @param {array} result.results - An array of doujins.
     * @param {number} page - The position of displayed doujin in the array.
     */
    async function generateDoujin(result, page) {
        const doujin = await nhentai.getDoujin(result.results[page].id);
        await dynamicEmbed.createEmbedFlip(command, [doujin], ['▶️'], createDoujinEmbed, generateContent, [doujin]);
    }

    // if an id is provided
    if (Number(args[0])) {
        if (await nhentai.exists(args[0])) {
            const doujin = await nhentai.getDoujin(args[0]);
            await dynamicEmbed.createEmbedFlip(command, [doujin], ['▶️'], createDoujinEmbed, generateContent, [doujin]);
        } else {
            return reply(command, language.invalidBookID, 'RED');
        }
    } else {
        // search the keyword given
        const result = await nana.search(args[0]);
        const page = 0;
        await dynamicEmbed.createEmbedFlip(command, result.results, ['⬅️', '➡️', '▶️'], createSearchEmbed, generateDoujin, [result, page]);
    }
}

module.exports = {
    name: 'nhentai',
    cooldown: 10,
    description: {
        'en_US': 'Search for a doujin on nhentai.',
        'zh_CN': '在nhentai上搜寻本本',
        'zh_TW': '在nhentai上搜尋本本',
    },
    options: [
        {
            name: 'id',
            description: {
                'en_US': '6 digit Nhentai ID',
                'zh_CN': '6位数N网号码',
                'zh_TW': '6位數N網號碼',
            },
            type: 'INTEGER',
        },
        {
            name: 'keyword',
            description: {
                'en_US': 'Keyword to search on Nhentai',
                'zh_CN': '在N网上搜索的关键词',
                'zh_TW': '在N網上搜索的關鍵詞',
            },
        },
    ],
    async execute(message, args, language) {
        await nhentaiFunc(message, args, language);
    },
    slashCommand: {
        async execute(interaction, language) {
            await nhentaiFunc(interaction, [interaction.options.getInteger('id')], language);
        },
    },
};
