const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const commandReply = new CommandReply();
const { MessageEmbed } = require('discord.js');
const Pixiv = require('pixiv.ts');
const refreshToken = process.env.PIXIV_REFRESH_TOKEN || require('../../config/config.json').PixivRefreshToken;
const fs = require('fs');

// search pixiv for loli pictures
async function loli(command) {
    const pixiv = await Pixiv.default.refreshLogin(refreshToken);
    const word = 'Chino Kafuu';
    let illusts;
    // if illust list exists
    if (fs.existsSync('./data/illusts.json')) {
        illusts = JSON.parse(fs.readFileSync('./data/illusts.json'));
    }
    else {
        // search 4 pages
        illusts = await pixiv.search.illusts({ word: word, r18: false, type: 'illust', bookmarks: '1000', search_target: 'partial_match_for_tags' });
        if (pixiv.search.nextURL) illusts = await pixiv.util.multiCall({ next_url: pixiv.search.nextURL, illusts }, 3);
    }

    const multipleIllusts = [];
    const targetURL = [];
    const embeds = [];
    // choose an illust randomly and send it
    const randomIllust = illusts[Math.floor(Math.random() * illusts.length)];
    if (randomIllust.meta_pages.length === 0 || randomIllust.meta_pages.length > 5) {
        targetURL.push(`https://pixiv.cat/${randomIllust.id}.png`);
    }
    else {
        for (let i = 1; i <= randomIllust.meta_pages.length; i++) {
            targetURL.push(`https://pixiv.cat/${randomIllust.id}-${i}.png`);
        }
    }
    targetURL.forEach((URL) => {
        const multipleIllust = new MessageEmbed()
            .setURL('https://www.pixiv.net')
            .setImage(URL);
        multipleIllusts.push(multipleIllust);
    });

    const embed = new MessageEmbed()
        .setTitle(randomIllust.title)
        .setURL(`https://www.pixiv.net/en/artworks/${randomIllust.id}`)
        .setColor('RANDOM')
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
        .setImage(multipleIllusts.length === 0 ? targetURL[0] : null);
    embeds.push(embed);
    if (multipleIllusts.length !== 0) {
        return await commandReply.edit(command, { embeds: multipleIllusts.concat(embeds), components: [], content: '\u200b' });
    }
    await commandReply.edit(command, { embeds: embeds, components: [], content: '\u200b' });
}
module.exports = {
    name: 'loli',
    cooldown: 3,
    description: true,
    async execute(message) {
        if (!refreshToken) return message.reply('This command can\'t be used without pixiv refreshToken!');
        const repliedMessage = await message.reply('Please wait...');
        await loli(repliedMessage);
    },
    slashCommand: {
        data: new SlashCommandBuilder()
        async execute(interaction) {
            if (!refreshToken) return interaction.reply('This command can\'t be used without pixiv refreshToken!');
            await interaction.deferReply();
            await loli(interaction);
        },
    },
};
