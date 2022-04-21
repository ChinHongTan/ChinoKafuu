const { reply } = require('../../functions/commandReply.js');
const { MessageEmbed } = require('discord.js');
const Pixiv = require('pixiv.ts');
const refreshToken = process.env.PIXIV_REFRESH_TOKEN || require('../../config/config.json').PixivRefreshToken;

function processIllustURL(illust) {
    const targetURL = [];
    if (illust.meta_pages.length === 0) {
        targetURL.push(illust.image_urls.medium.replace('pximg.net', 'pixiv.cat'));
    }
    if (illust.meta_pages.length > 5) {
        targetURL.push(illust.meta_pages[0].image_urls.medium.replace('pximg.net', 'pixiv.cat'));
    } else {
        for (let i = 0; i < illust.meta_pages.length; i++) {
            targetURL.push(illust.meta_pages[i].image_urls.medium.replace('pximg.net', 'pixiv.cat'));
        }
    }
    return targetURL;
}

function generateIllustDescriptionEmbed(illust) {
    const multipleIllusts = [];

    const targetURL = processIllustURL(illust);

    targetURL.forEach((URL) => {
        const imageEmbed = new MessageEmbed()
            .setURL('https://www.pixiv.net')
            .setImage(URL)
            .setColor('RANDOM');
        multipleIllusts.push(imageEmbed);
    });

    const descriptionEmbed = new MessageEmbed()
        .setTitle(illust.title)
        .setURL(`https://www.pixiv.net/en/artworks/${illust.id}`)
        .setColor('RANDOM')
        // remove html tags
        .setDescription(illust
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
    return multipleIllusts;
}

// search pixiv for illusts
async function pixivFunc(command, subcommand, language) {
    const pixiv = await Pixiv.default.refreshLogin(refreshToken);
    let illusts = [];
    let illust;
    switch (subcommand) {
    case 'illust':
        try {
            illust = await pixiv.search.illusts({
                illust_id: command.options.getInteger('illust_id'),
            });
        } catch (error) {
            return reply(command, language.noIllust, 'RED');
        }
        break;
    case 'author':
        try {
            illusts = await pixiv.user.illusts({
                user_id: command.options.getInteger('author_id'),
            });
        } catch (error) {
            return reply(command, language.noUser, 'RED');
        }
        illust = illusts[Math.floor(Math.random() * illusts.length)];
        break;
    case 'query':
        illusts = await pixiv.search.illusts({
            word: command.options.getString('query'),
            r18: false,
            bookmarks: command.options.getString('bookmarks') || '1000',
        });
        if (illusts.length === 0) return reply(command, language.noResult, 'RED');
        if (pixiv.search.nextURL && command.options?.getInteger('pages') !== 1) {
            illusts = await pixiv.util.multiCall({
                next_url: pixiv.search.nextURL, illusts,
            // minus 1 because we had already searched the first page
            }, command.options.getInteger('pages') - 1 || 0);
        }
        illust = illusts[Math.floor(Math.random() * illusts.length)];
        break;
    }
    const illustEmbed = generateIllustDescriptionEmbed(illust);
    return reply(command, { embeds: illustEmbed });
}

module.exports = {
    name: 'pixiv',
    cooldown: 3,
    description: {
        'en_US': 'Search and get an illust on pixiv',
        'zh_CN': '在pixiv网站上搜索图片',
        'zh_TW': '在pixiv網站上搜索圖片',
    },
    subcommandGroups: [
        {
            name: 'search',
            description: {
                'en_US': 'Search on pixiv',
                'zh_CN': '在pixiv上搜索',
                'zh_TW': '在pixiv上搜索',
            },
            subcommands: [
                {
                    name: 'illust',
                    description: {
                        'en_US': 'Search an illust with given ID',
                        'zh_CN': '用ID搜索画作',
                        'zh_TW': '用ID搜索畫作',
                    },
                    options: [
                        {
                            name: 'illust_id',
                            description: {
                                'en_US': 'ID of the illust',
                                'zh_CN': '画作ID',
                                'zh_TW': '畫作ID',
                            },
                            type: 'INTEGER',
                            required: true,
                        },
                    ],
                },
                {
                    name: 'author',
                    description: {
                        'en_US': 'Search and get a random illust from the author',
                        'zh_CN': '搜索并取得绘师随机的一个画作',
                        'zh_TW': '搜索並取得繪師隨機的一個畫作',
                    },
                    options: [
                        {
                            name: 'author_id',
                            description: {
                                'en_us': 'ID of the author',
                                'zh_CN': '绘师ID',
                                'zh_TW': '繪師ID',
                            },
                            type: 'INTEGER',
                            required: true,
                        },
                    ],
                },
                {
                    name: 'query',
                    description: {
                        'en_US': 'query to search illust on pixiv',
                        'zh_CN': '在pixiv上搜索关键词',
                        'zh_TW': '在pixiv上搜索關鍵詞',
                    },
                    options: [
                        {
                            name: 'query',
                            description: {
                                'en_US': 'Query to search illust on pixiv',
                                'zh_CN': '在pixiv上搜索关键词',
                                'zh_TW': '在pixiv上搜索關鍵詞',
                            },
                            type: 'STRING',
                            required: true,
                            autocomplete: true,
                        },
                        {
                            name: 'bookmarks',
                            description: {
                                'en_US': 'filter search results with bookmarks, default to 1000 bookmarks',
                                'zh_CN': '用书签数量过滤画作，默认为1000个书签',
                                'zh_TW': '用書籤數量過濾畫作，默認為1000個書籤',
                            },
                            type: 'STRING',
                            choices: [
                                ['50', '50'], ['100', '100'], ['300', '300'], ['500', '500'], ['1000', '1000'],
                                ['3000', '3000'], ['5000', '5000'], ['10000', '10000'],
                            ],
                        },
                        {
                            name: 'pages',
                            description:  {
                                'en_US': 'how many pages to search (more pages = longer), default to 1',
                                'zh_CN': '搜索页数（頁數越多搜索时间越长），默认为1',
                                'zh_TW': '搜索頁數（頁數越多搜索時間越長），默認為1',
                            },
                            type: 'INTEGER',
                            min: 1,
                            max: 10,
                        },
                    ],
                },
            ],
        },
    ],
    async execute(message, args, language) {
        if (!refreshToken) return reply(message, language.noToken, 'RED');
        const repliedMessage = await reply(message, language.wait, 'YELLOW');
        if (args[0] === 'search') return await pixivFunc(repliedMessage, args[1], language);
    },
    slashCommand: {
        async execute(interaction, language) {
            if (!refreshToken) return interaction.reply(language.noToken);
            await interaction.deferReply();
            await pixivFunc(interaction, interaction.options.getSubcommand(), language);
        },
        async autoComplete(interaction) {
            const pixiv = await Pixiv.default.refreshLogin(refreshToken);
            const keyword = interaction.options.getString('query');
            const candidates = await pixiv.web.candidates({ keyword: keyword, lang: 'en' });
            const respondArray = [];
            candidates.candidates.forEach(tag => {
                respondArray.push({ name: `${tag.tag_name} <${tag.tag_translation ?? ''}>`, value: tag.tag_name });
            });
            // respond to the request
            return interaction.respond(respondArray);
        },
    },
};
