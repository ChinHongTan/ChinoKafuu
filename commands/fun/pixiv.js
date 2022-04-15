const { SlashCommandBuilder } = require('@discordjs/builders');
const { reply } = require('../../functions/commandReply.js');
const { MessageEmbed } = require('discord.js');
const Pixiv = require('pixiv.ts');
const refreshToken = process.env.PIXIV_REFRESH_TOKEN || require('../../config/config.json').PixivRefreshToken;

function processIllustURL(illust) {
    const targetURL = [];
    if (illust.meta_pages.length === 0) {
        targetURL.push(illust.meta_single_page.original_image_url.replace('pximg.net', 'pixiv.cat'));
    }
    if (illust.meta_pages.length > 5) {
        targetURL.push(illust.meta_pages[0].image_urls.original.replace('pximg.net', 'pixiv.cat'));
    } else {
        for (let i = 0; i < illust.meta_pages.length; i++) {
            targetURL.push(illust.meta_pages[i].image_urls.original.replace('pximg.net', 'pixiv.cat'));
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
async function pixivFunc(command, subcommand) {
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
            return reply(command, 'illust doesn\'t exist!', 'RED');
        }
        break;
    case 'author':
        try {
            illusts = await pixiv.user.illusts({
                user_id: command.options.getInteger('author_id'),
            });
        } catch (error) {
            return reply(command, 'User doesn\'t exist!', 'RED');
        }
        illust = illusts[Math.floor(Math.random() * illusts.length)];
        break;
    case 'query':
        illusts = await pixiv.search.illusts({
            word: command.options.getString('query'),
            r18: command.options.getBoolean('r18'),
            bookmarks: command.options.getString('bookmarks') || '1000',
        });
        if (illusts.length === 0) return reply(command, 'No result found!', 'RED');
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
    description: true,
    async execute(message) {
        if (!refreshToken) return reply(message, 'This command can\'t be used without pixiv refreshToken!', 'RED');
        const repliedMessage = await reply(message, 'Please wait...', 'YELLOW');
        await pixivFunc(repliedMessage);
    },
    slashCommand: {
        data: new SlashCommandBuilder()
            .addSubcommandGroup(subcommandGroup =>
                subcommandGroup
                    .setName('search')
                    .setDescription('Search on pixiv with given id')
                    .addSubcommand(subcommand =>
                        subcommand
                            .setName('illust')
                            .setDescription('Search an illust with given ID')
                            .addIntegerOption(option =>
                                option
                                    .setName('illust_id')
                                    .setDescription('ID of the illust')
                                    .setRequired(true),
                            ),
                    )
                    .addSubcommand(subcommand =>
                        subcommand
                            .setName('author')
                            .setDescription('Search and get a random illust from the author')
                            .addIntegerOption(option =>
                                option
                                    .setName('author_id')
                                    .setDescription('Search an author with given ID')
                                    .setRequired(true),
                            ),
                    )
                    .addSubcommand(subcommand =>
                        subcommand
                            .setName('query')
                            .setDescription('query to search illust on pixiv')
                            .addStringOption(option =>
                                option
                                    .setName('query')
                                    .setDescription('query to search illust on pixiv')
                                    .setAutocomplete(true)
                                    .setRequired(true),
                            )
                            .addBooleanOption(option =>
                                option
                                    .setName('r18')
                                    .setDescription('whether to search with r18 mode')
                                    .setRequired(true),
                            )
                            .addStringOption(option =>
                                option
                                    .setName('bookmarks')
                                    .setDescription('filter search results with bookmarks, default to 1000 bookmarks')
                                    .addChoices([
                                        ['50', '50'], ['100', '100'], ['300', '300'], ['500', '500'], ['1000', '1000'],
                                        ['3000', '3000'], ['5000', '5000'], ['10000', '10000'],
                                    ]),
                            )
                            .addIntegerOption(option =>
                                option
                                    .setName('pages')
                                    .setMinValue(1)
                                    .setMaxValue(10)
                                    .setDescription('how many pages to search (more pages = longer), default to 1'),
                            ),
                    ),
            ),
        async execute(interaction) {
            if (!refreshToken) return interaction.reply('This command can\'t be used without pixiv refreshToken!');
            await interaction.deferReply();
            await pixivFunc(interaction, interaction.options.getSubcommand());
        },
        async autoComplete(interaction) {
            const pixiv = await Pixiv.default.refreshLogin(refreshToken);
            const keyword = interaction.options.getString('query');
            const suggestedKeywords = await pixiv.search.autoCompleteV2({ word: keyword });
            const respondArray = [];
            suggestedKeywords.tags.forEach(tag => {
                respondArray.push({ name: tag.name, value: tag.name });
            });
            // respond to the request
            return interaction.respond(respondArray);
        },
    },
};
