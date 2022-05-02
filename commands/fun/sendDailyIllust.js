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
    description: {
        'en_US': 'Send daily illust manually',
        'zh_CN': '发送每日图',
        'zh_TW': '發送每日圖',
    },
    async execute(message) {
        if (!refreshToken) return message.reply('沒token啦幹');
        await sendDaily(message);
    },
    slashCommand: {
        async execute(interaction) {
            if (!refreshToken) return interaction.reply('沒token啦幹');
            await interaction.deferReply();
            await sendDaily(interaction);
        },
    },
};