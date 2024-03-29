const { SlashCommandBuilder } = require('@discordjs/builders');
const { info, sendSuggestedIllust } = require('../../functions/Util.js');
const refreshToken = process.env.PIXIV_REFRESH_TOKEN || require('../../config/config.json').PixivRefreshToken;

async function sendDaily(command) {
    if (refreshToken) {
        await info(command, 'Sending...');
        await sendSuggestedIllust(await command.client.channels.fetch('970590759944335361'));
        await info(command, 'Done!');
    }
}

module.exports = {
    name: 'send_daily',
    aliases: ['daily'],
    coolDown: 3,
    ownerOnly: true,
    data: new SlashCommandBuilder()
        .setName('send_daily')
        .setDescription('發送每日圖')
        .setDescriptionLocalizations({
            'en-US': 'Send daily illust manually',
            'zh-CN': '发送每日图',
            'zh-TW': '發送每日圖',
        }),
    async execute(interaction) {
        if (!refreshToken) return interaction.reply('沒token啦幹');
        await interaction.deferReply();
        await sendDaily(interaction);
    },
};