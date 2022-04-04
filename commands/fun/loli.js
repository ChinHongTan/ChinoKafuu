const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const commandReply = new CommandReply();
const { MessageEmbed } = require('discord.js');
const Pixiv = require('pixiv.ts');
const refreshToken = process.env.PIXIV_REFRESH_TOKEN || require('../../config/config.json').PixivRefreshToken;

// search pixiv for loli pictures
async function loli(command, language) {
    const pixiv = await Pixiv.default.refreshLogin(refreshToken);
    const word = 'Chino Kafuu';
    // search 4 pages
    let illusts = await pixiv.search.illusts({ word: word, r18: false, type: 'illust', bookmarks: '1000', search_target: 'partial_match_for_tags' });
    if (pixiv.search.nextURL) illusts = await pixiv.util.multiCall({ next_url: pixiv.search.nextURL, illusts }, 3);
    const randomIllust = illusts[Math.floor(Math.random() * illusts.length)];
    const targetURL = randomIllust.meta_pages.length === 0 ? `https://pixiv.cat/${randomIllust.id}.png` : `https://pixiv.cat/${randomIllust.id}-1.png`;
    const embed = new MessageEmbed()
        .setTitle(randomIllust.title)
        .setURL(`https://www.pixiv.net/en/artworks/${randomIllust.id}`)
        // remove html tags
        .setDescription(randomIllust
            ?.caption
            .replace(/\n/ig, '')
            .replace(/<style[^>]*>[\s\S]*?<\/style[^>]*>/ig, '')
            .replace(/<head[^>]*>[\s\S]*?<\/head[^>]*>/ig, '')
            .replace(/<script[^>]*>[\s\S]*?<\/script[^>]*>/ig, '')
            .replace(/<\/\s*(?:p|div)>/ig, '\n')
            .replace(/<br[^>]*\/?>/ig, '\n')
            .replace(/<[^>]*>/ig, '')
            .replace('&nbsp;', ' ')
            .replace(/[^\S\r\n][^\S\r\n]+/ig, ' '))
        .setImage(targetURL);
    await commandReply.edit(command, embed);
}
module.exports = {
    name: 'loli',
    cooldown: 3,
    description: true,
    async execute(message, _args, language) {
        if (!refreshToken) return message.reply('This command can\'t be used without pixiv refreshToken!');
        const repliedMessage = await message.reply('Please wait...');
        await loli(repliedMessage, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder(),
        async execute(interaction, language) {
            if (!refreshToken) return interaction.reply('This command can\'t be used without pixiv refreshToken!');
            await interaction.deferReply();
            await loli(interaction, language);
        },
    },
};
