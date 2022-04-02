const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const commandReply = new CommandReply();
const { MessageEmbed, MessageAttachment } = require('discord.js');
const Pixiv = require('pixiv.ts');
const refreshToken = process.env.PIXIV_REFRESH_TOKEN || require('../../config/config.json').PixivRefreshToken;

async function loli(command, language) {
    const pixiv = await Pixiv.default.refreshLogin(refreshToken);
    const word = 'Chino Kafuu';
    let illusts = await pixiv.search.illusts({ word: word, r18: false, type:'illust', bookmarks: '500', search_target: 'partial_match_for_tags' });
    if (pixiv.search.nextURL) illusts = await pixiv.util.multiCall({ next_url: pixiv.search.nextURL, illusts }, 3);
    const sorted_illusts = pixiv.util.sort(illusts);
    const randomIllust = sorted_illusts[Math.floor(Math.random() * sorted_illusts.length)];
    await pixiv.util.downloadIllust(`https://www.pixiv.net/en/artworks/${randomIllust.id}`, './illust', 'original');
    try {
        const file = new MessageAttachment(`./illust/${randomIllust.id}.png`);
        const embed = new MessageEmbed()
            .setTitle(randomIllust.title)
            .setURL(`https://www.pixiv.net/en/artworks/${randomIllust.id}`)
            .setDescription(randomIllust.caption)
            .setImage(`attachment://${randomIllust.id}.png`);
        await command.editReply({ embeds: [embed], files: [file] });
    } catch (e) {
        const file = new MessageAttachment(`./illust/${randomIllust.id}_p0.png`);
        const embed = new MessageEmbed()
            .setImage(`attachment://${randomIllust.id}.png`);
        await command.editReply({ embeds: [embed], files: [file] });
    }
}
module.exports = {
    name: 'loli',
    cooldown: 3,
    description: true,
    execute(message, _args, language) {
        message.reply('Please wait...');
        loli(message, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder(),
        async execute(interaction, language) {
            interaction.deferReply();
            loli(interaction, language);
        },
    },
};
