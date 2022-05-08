const { edit, error, generateIllustEmbed, translate } = require('../../functions/Util.js');
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
        illusts = JSON.parse(fs.readFileSync('./data/illusts.json', 'utf-8'));
    } else {
        // search 4 pages
        illusts = await pixiv.search.illusts({
            word: word,
            type: 'illust',
            bookmarks: '1000',
            r18: false,
            search_target: 'partial_match_for_tags',
        });
        if (pixiv.search.nextURL) {
            illusts = await pixiv.util.multiCall({ next_url: pixiv.search.nextURL, illusts }, 3);
        }
        illusts = illusts.filter((illust) => {
            return illust.x_restrict === 0 && illust.total_bookmarks >= 1000;
        });
    }

    // choose an illust randomly and send it
    const randomIllust = illusts[Math.floor(Math.random() * illusts.length)];
    const illustEmbed = generateIllustEmbed(randomIllust);

    return await edit(command, { embeds: illustEmbed, components: [], content: '\u200b' });
}
module.exports = {
    name: 'loli',
    coolDown: 3,
    description: {
        'en_US': 'Get a picture of a loli',
        'zh_CN': '萝莉图',
        'zh_TW': '蘿莉圖',
    },
    async execute(message) {
        if (!refreshToken) return error(message, translate('noToken', message.guild));
        await loli(message);
    },
    slashCommand: {
        async execute(interaction) {
            if (!refreshToken) return error(interaction, translate('noToken', interaction.guild));
            await interaction.deferReply();
            await loli(interaction);
        },
    },
};
