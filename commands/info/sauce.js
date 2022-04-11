const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const { MessageEmbed } = require('discord.js');
const commandReply = new CommandReply();
const sagiriToken = process.env.SAGIRI || require('../../config/config.json').sagiri_token;
const sagiri = require('sagiri');
let mySauce;
if (sagiriToken) mySauce = sagiri(sagiriToken);
const DynamicEmbed = require('../../functions/dynamicEmbed');
const dynamicEmbed = new DynamicEmbed();

async function sauce(command, args, language) {
    /**
     * Generates a discord embed showing the results from saucenao
     * @param {object} response - Response object from sauceNao API call
     * @param {string} response.url - image source url
     * @param {string} response.site - site where image is found
     * @param {number} response.similarity - similarity of result image with query image
     * @param {string} response.thumbnail - link of the result image
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
     * Function to send embed message
     * @param {object} response - Response object from the API call
     */
    function sendEmbed(response) {
        dynamicEmbed.createEmbedFlip(command, response, ['⬅️', '➡️'], createEmbed);
    }

    /**
     * Search for an image from sauceNao
     * @param {string} searchImage - url of the target image to search for.
     */
    async function searchForImage(searchImage) {
        const result = await mySauce(searchImage, { results: 10 });
        // filters out the not similar results
        const response = result.filter((r) => r.similarity > 80);

        if (response.length > 0) {
            return sendEmbed(response);
        }
        // no image found
        return commandReply.reply(command, language.noResult, 'RED');
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
        return commandReply.reply(command, language.noImage, 'RED');
    }
    await commandReply.reply(command, language.searchingSauce, 'YELLOW');
    await searchForImage(searchImage);
}

module.exports = {
    name: 'sauce',
    description: true,
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
