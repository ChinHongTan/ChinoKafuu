const { error, reply, generateIllustEmbed } = require('../../functions/Util.js');
const Pixiv = require('pixiv.ts');
const { SlashCommandBuilder } = require('@discordjs/builders');
const refreshToken = process.env.PIXIV_REFRESH_TOKEN || require('../../config/config.json').PixivRefreshToken;

// search pixiv for illusts
async function pixivFunc(command, args, language) {
    const pixiv = await Pixiv.default.refreshLogin(refreshToken);
    let illusts = [];
    let illust;
    const subcommand = args[1];
    switch (subcommand) {
    case 'illust':
        try {
            illust = await pixiv.search.illusts({
                illust_id: command?.options?.getInteger('illust_id') ?? args[2],
            });
        } catch (err) {
            return error(command, language.noIllust);
        }
        break;
    case 'author':
        try {
            illusts = await pixiv.user.illusts({
                user_id: command?.options?.getInteger('author_id') ?? args[2],
            });
        } catch (err) {
            return error(command, language.noUser);
        }
        illust = illusts[Math.floor(Math.random() * illusts.length)];
        break;
    case 'query':
        illusts = await pixiv.search.illusts({
            word: command?.options?.getString('query') ?? args[2],
            r18: false,
            bookmarks: (command.options.getString('bookmarks') ?? args[3]) || '1000',
        });
        if (illusts.length === 0) return error(command, language.noResult);
        if (pixiv.search.nextURL && (command?.options?.getInteger('pages') ?? parseInt(args[4], 10)) !== 1) {
            illusts = await pixiv.util.multiCall({
                next_url: pixiv.search.nextURL, illusts,
            // minus 1 because we had already searched the first page
            }, (command.options.getInteger('pages') ?? parseInt(args[4])) - 1 || 0);
        }
        illust = illusts[Math.floor(Math.random() * illusts.length)];
        break;
    default:
        return error(command, language.unknownSubcommand);
    }
    const illustEmbed = generateIllustEmbed(illust);
    return reply(command, { embeds: illustEmbed });
}

module.exports = {
    name: 'pixiv',
    coolDown: 3,
    data: new SlashCommandBuilder()
        .setName('pixiv')
        .setDescriptionLocalizations({
            'en-US': 'Search and get an illust on pixiv',
            'zh-CN': '在pixiv网站上搜索图片',
            'zh-TW': '在pixiv網站上搜索圖片',
        })
        .addSubcommandGroup((group) => group
            .setName('search')
            .setDescriptionLocalizations({
                'en-US': 'Search on pixiv',
                'zh-CN': '在pixiv上搜索',
                'zh-TW': '在pixiv上搜索',
            })
            .addSubcommand((subcommand) => subcommand
                .setName('illust')
                .setDescriptionLocalizations({
                    'en-US': 'Search an illust with given ID',
                    'zh-CN': '用ID搜索画作',
                    'zh-TW': '用ID搜索畫作',
                })
                .addIntegerOption((option) => option
                    .setName('illust_id')
                    .setDescriptionLocalizations({
                        'en-US': 'ID of the illust',
                        'zh-CN': '画作ID',
                        'zh-TW': '畫作ID',
                    })
                    .setRequired(true),
                ),
            )
            .addSubcommand((subcommand) => subcommand
                .setName('author')
                .setDescriptionLocalizations({
                    'en-US': 'Search and get a random illust from the author',
                    'zh-CN': '搜索并取得绘师随机的一个画作',
                    'zh-TW': '搜索並取得繪師隨機的一個畫作',
                })
                .addIntegerOption((option) => option
                    .setName('author_id')
                    .setDescriptionLocalizations({
                        'en-US': 'ID of the author',
                        'zh-CN': '绘师ID',
                        'zh-TW': '繪師ID',
                    })
                    .setRequired(true),
                ),
            )
            .addSubcommand((subcommand) => subcommand
                .setName('query')
                .setDescriptionLocalizations({
                    'en-US': 'query to search illust on pixiv',
                    'zh-CN': '在pixiv上搜索关键词',
                    'zh-TW': '在pixiv上搜索關鍵詞',
                })
                .addStringOption((option) => option
                    .setName('query')
                    .setDescriptionLocalizations({
                        'en-US': 'Query to search illust on pixiv',
                        'zh-CN': '在pixiv上搜索关键词',
                        'zh-TW': '在pixiv上搜索關鍵詞',
                    })
                    .setRequired(true)
                    .setAutocomplete(true),
                )
                .addStringOption((option) => option
                    .setName('bookmarks')
                    .setDescriptionLocalizations({
                        'en-US': 'filter search results with bookmarks, default to 1000 bookmarks',
                        'zh-CN': '用书签数量过滤画作，默认为1000个书签',
                        'zh-TW': '用書籤數量過濾畫作，默認為1000個書籤',
                    })
                    .addChoices(
                        { name: '50', value: '50' },
                        { name: '100', value: '100' },
                        { name: '300', value: '300' },
                        { name: '500', value: '500' },
                        { name: '1000', value: '1000' },
                        { name: '3000', value: '3000' },
                        { name: '5000', value: '5000' },
                        { name: '10000', value: '10000' },
                    ),
                )
                .addIntegerOption((option) => option
                    .setName('pages')
                    .setDescriptionLocalizations({
                        'en-US': 'how many pages to search (more pages = longer), default to 1',
                        'zh-CN': '搜索页数（頁數越多搜索时间越长），默认为1',
                        'zh-TW': '搜索頁數（頁數越多搜索時間越長），默認為1',
                    })
                    .setMinValue(1)
                    .setMaxValue(10),
                ),
            ),
        ),
    async execute(interaction, language) {
        if (!refreshToken) return interaction.reply(language.noToken);
        await interaction.deferReply();
        await pixivFunc(interaction, [interaction.options.getSubcommandGroup(), interaction.options.getSubcommand()], language);
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
};
