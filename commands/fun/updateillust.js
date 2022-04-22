const { reply } = require('../../functions/commandReply.js');
const refreshToken = process.env.PIXIV_REFRESH_TOKEN || require('../../config/config.json').PixivRefreshToken;

const updateIllust = require('../../functions/updateIllust');
async function update(command) {
    if (refreshToken) {
        await reply(command, 'Updating pixiv illust list...', 'YELLOW');
        await updateIllust('Chino Kafuu');
        await reply(command, 'Done!', 'BLUE');
    }
}

module.exports = {
    name: 'update_illust',
    aliases: ['ui', 'update', 'refresh', 'ri'],
    cooldown: 3,
    ownerOnly: true,
    description: {
        'en_US': 'Update the illust list used in loli command.',
        'zh_CN': '更新萝莉功能使用的pixiv图片列表',
        'zh_TW': '更新蘿莉功能使用的pixiv圖片列表',
    },
    async execute(message, _, language) {
        if (!refreshToken) return message.reply(language.noToken);
        const repliedMessage = await message.reply(language.wait);
        await update(repliedMessage);
    },
    slashCommand: {
        async execute(interaction, language) {
            if (!refreshToken) return interaction.reply(language.noToken);
            await interaction.deferReply();
            await update(interaction);
        },
    },
};