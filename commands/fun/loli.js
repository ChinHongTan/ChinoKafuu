const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const commandReply = new CommandReply();
const { MessageEmbed } = require('discord.js');
const Pixiv = require('pixiv.ts');
const refreshToken = process.env.PIXIV_REFRESH_TOKEN || require('../../config/config.json').PixivRefreshToken;
const fs = require('fs');

// search pixiv for loli pictures
async function loli(command, args) {
    const num = args[0] ?? 1;
    if (args[0] > 10) return commandReply.reply(command, 'Number cannot exceed 10!', 'RED');
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

    const embeds = [];
    const multipleIllusts = [];
    for (let i = 0; i < num; i++) {
        // choose an illust randomly and send it
        const randomIllust = illusts[Math.floor(Math.random() * illusts.length)];
        const targetURL = randomIllust.meta_pages.length === 0 ? `https://pixiv.cat/${randomIllust.id}.png` : `https://pixiv.cat/${randomIllust.id}-1.png`;
        if (num >= 2 && num <= 4) {
            const multipleIllust = new MessageEmbed()
                .setUrl('https://www.pixiv.net')
                .setImage(targetURL)
            multipleIllusts.push(multipleIllust);
        }
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
            .setImage(multipleIllusts.length === 0 ? targetURL : null);
        embeds.push(embed);
    }
    if (num >= 2 && num <= 4) {
        return await commandReply.edit(command, { embeds: multipleIllusts.concat(embeds), components: [], content: '\u200b' });
    }
    await commandReply.edit(command, { embeds: embeds, components: [], content: '\u200b' });
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
        data: new SlashCommandBuilder()
            .addIntegerOption((option) =>
                option.setName('number').setDescription('Number of illusts to be send at once')),
        async execute(interaction, language) {
            if (!refreshToken) return interaction.reply('This command can\'t be used without pixiv refreshToken!');
            await interaction.deferReply();
            await loli(interaction, [interaction.options.getInteger('number') ?? 1], language);
        },
    },
};
