const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const commandReply = new CommandReply();
const { MessageEmbed, MessageAttachment } = require('discord.js');
const Pixiv = require('pixiv.ts');
const fs = require('fs');
const refreshToken = process.env.PIXIV_REFRESH_TOKEN || require('../../config/config.json').PixivRefreshToken;

async function loli(command, language) {
    const pixiv = await Pixiv.default.refreshLogin(refreshToken);
    const word = 'Chino Kafuu';
    let illusts = await pixiv.search.illusts({ word: word, r18: false, type: 'illust', bookmarks: '1000', search_target: 'partial_match_for_tags' });
    if (pixiv.search.nextURL) illusts = await pixiv.util.multiCall({ next_url: pixiv.search.nextURL, illusts }, 3);
    const randomIllust = illusts[Math.floor(Math.random() * illusts.length)];
    await pixiv.util.downloadIllust(`https://www.pixiv.net/en/artworks/${randomIllust.id}`, './illust', 'original');
    const target_file = fs.existsSync(`./illust/${randomIllust.id}.png`) ? `./illust/${randomIllust.id}.png` : `./illust/${randomIllust.id}_p0.jpg`;
    const file = new MessageAttachment(target_file);
    const embed = new MessageEmbed()
        .setTitle(randomIllust.title)
        .setURL(`https://www.pixiv.net/en/artworks/${randomIllust.id}`)
        .setDescription(randomIllust?.caption)
        .setImage(`attachment://${target_file}`);
    await commandReply.edit(command, { embeds: [embed], files: [file] });
}
module.exports = {
    name: 'loli',
    cooldown: 3,
    description: true,
    async execute(message, _args, language) {
        const repliedMessage = await message.reply('Please wait...');
        loli(repliedMessage, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder(),
        async execute(interaction, language) {
            await interaction.deferReply();
            loli(interaction, language);
        },
    },
};
