const { reply, edit } = require('../../functions/commandReply.js');
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

    const multipleIllusts = [];
    const targetURL = [];

    // choose an illust randomly and send it
    const randomIllust = illusts[Math.floor(Math.random() * illusts.length)];
    if (randomIllust.meta_pages.length === 0) {
        targetURL.push(randomIllust.meta_single_page.original_image_url.replace('pximg.net', 'pixiv.cat'));
    }
    if (randomIllust.meta_pages.length > 5) {
        targetURL.push(randomIllust.meta_pages[0].image_urls.original.replace('pximg.net', 'pixiv.cat'));
    } else {
        for (let i = 0; i < randomIllust.meta_pages.length; i++) {
            targetURL.push(randomIllust.meta_pages[i].image_urls.original.replace('pximg.net', 'pixiv.cat'));
        }
    }

    targetURL.forEach((URL) => {
        const multipleIllust = new MessageEmbed()
            .setURL('https://www.pixiv.net')
            .setImage(URL)
            .setColor('RANDOM');
        multipleIllusts.push(multipleIllust);
    });

    const descriptionEmbed = new MessageEmbed()
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
            .replace(/[^\S\r\n][^\S\r\n]+/ig, ' '));
    multipleIllusts.push(descriptionEmbed);

    return await edit(command, { embeds: multipleIllusts, components: [], content: '\u200b' });
}
module.exports = {
    name: 'loli',
    cooldown: 3,
    description: {
        'en_US': 'Get a picture of a loli',
        'zh_CN': '萝莉图',
        'zh_TW': '蘿莉圖',
    },
    async execute(message, _, language) {
        if (!refreshToken) return reply(message, language.noToken, 'RED');
        const repliedMessage = await reply(message, language.wait, 'YELLOW');
        await loli(repliedMessage);
    },
    slashCommand: {
        async execute(interaction, language) {
            if (!refreshToken) return reply(interaction, language.noToken, 'RED');
            await interaction.deferReply();
            await loli(interaction);
        },
    },
};
