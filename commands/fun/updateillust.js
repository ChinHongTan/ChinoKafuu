const { info } = require('../../functions/Util.js');
const refreshToken = process.env.PIXIV_REFRESH_TOKEN || require('../../config/config.json').PixivRefreshToken;

const { updateIllust } = require('../../functions/Util.js');
async function update(command) {
    if (refreshToken) {
        await info(command, 'Updating pixiv illust list...');
        await updateIllust('Chino Kafuu');
        await info(command, 'Done!');
    }
}

module.exports = {
    name: 'update_illust',
    aliases: ['ui', 'update', 'refresh', 'ri'],
    coolDown: 3,
    ownerOnly: true,
    description: {
        'en_US': 'Update the illust list used in loli command.',
        'zh_CN': '更新萝莉功能使用的pixiv图片列表',
        'zh_TW': '更新蘿莉功能使用的pixiv圖片列表',
    },
    async execute(message, _, language) {
        if (!refreshToken) return message.reply(language.noToken);
        await update(message);
    },
    slashCommand: {
        async execute(interaction, language) {
            if (!refreshToken) return interaction.reply(language.noToken);
            await interaction.deferReply();
            await update(interaction);
        },
    },
};