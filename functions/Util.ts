
import {
    Client,
    Collection,
    ColorResolvable,
    CommandInteraction, GuildMember,
    InteractionReplyOptions,
    Message, 
    MessageEmbed,
    MessageReaction, Snowflake, TextChannel
} from "discord.js";

import Pixiv, {PixivIllust} from "pixiv.ts";
import * as fs from "fs";
import { Collection as DB } from "mongodb";

const refreshToken = process.env.PIXIV_REFRESH_TOKEN || require('../config/config.json').PixivRefreshToken;


interface SlashCommand {
    execute(interaction, language): Promise<any>;
    autoComplete?(interaction): Promise<void>,
}

interface Description {
    'en-US': string,
    'zh-CN': string,
    'zh-TW': string,
}

interface BaseCommand {
    name: string,
    description: Description,
}

interface SubcommandOptions extends BaseCommand {
    type: 'STRING' | 'INTEGER' | 'BOOLEAN' | 'NUMBER' | 'USER' | 'CHANNEL' | 'ROLE' | 'MENTIONABLE',
    required?: boolean,
    choices?: [name: string, value: string][],
    min?: number,
    max?: number,
    autocomplete?: boolean
}

interface Subcommand extends BaseCommand {
    options?: SubcommandOptions[],
}

interface SubcommandGroup extends BaseCommand {
    subcommands: Subcommand[],
}

interface Translation {
    [message: string]: [translation: string],
}

interface Command extends BaseCommand {
    coolDown: number,
    slashCommand: SlashCommand,
    subcommandGroups?: SubcommandGroup[],
    subcommands?: Subcommand[],
    options?: SubcommandOptions[],
    execute(message: Message, args: string[], language: Translation),
}

interface Snipe {
    author: string,
    authorAvatar: string,
    content: string,
    timeStamp: Date,
    attachment?: string,
}

interface CustomClient extends Client {
    commands: Collection<string, Command>,
    language: { [commandName: string]: Translation },
    coolDowns: Collection<string, Collection<Snowflake, number>>
    guildDatabase: DB,
    guildCollection: Collection<Snowflake, { id: Snowflake,
        data: {
            language: Language,
            channel?: Snowflake,
            levelReward?: { [level: number]: Snowflake },
            autoResponse?: { [message: string]: string[] },
            snipes: Snipe[],
            editSnipes: Snipe[],
            users: {
                id: Snowflake,
                exp: number,
                level: number,
                expAddTimestamp?: number,
            }[],
    } }>
    userDatabase:DB,
}
type Language = 'en-US' | 'zh-CN' | 'zh-TW';

// reply with embeds

// check if something is string
function isString(x: any): x is string {
    return typeof x === "string";
}

// reply to a user command
export async function reply(command: CommandInteraction, response: string | InteractionReplyOptions, color?: ColorResolvable) {
    if (isString(response)) return command.reply({ embeds: [{ description: response, color: color }] });
    if (command.deferred) return await command.editReply(response);
    command.reply(response);
    return await command.fetchReply();
}

// edit a message or interaction
export async function edit(command: CommandInteraction, response?: string | InteractionReplyOptions | MessageEmbed, color?: ColorResolvable) {
    if (isString(response)) return await command.editReply({ embeds: [{ description: response, color: color }], components: [], content: '\u200b' });
    if (response instanceof MessageEmbed) return await command.editReply({ embeds: [response], components: [], content: '\u200b' });
    return await command.editReply(response);
}

export async function error(command: CommandInteraction, response: InteractionReplyOptions) {
    const message = await reply(command, `❌ | ${response}`, 'Red');
    if (message instanceof Message) {
        setTimeout(() => message.delete(), 10000);
    }
}

export async function warn(command: CommandInteraction, response: InteractionReplyOptions) {
    return await reply(command, `⚠ | ${response}`, 'Yellow');
}

export async function success(command: CommandInteraction, response: InteractionReplyOptions) {
    return await reply(command, `✅ | ${response}`, 'Green');
}

export async function info(command: CommandInteraction, response: InteractionReplyOptions) {
    return await reply(command, `ℹ | ${response}`, 'Blue')
}

export async function updateIllust(query: string) {
    const pixiv = await Pixiv.refreshLogin(refreshToken);
    let illusts = await pixiv.search.illusts({ word: query, type: 'illust', bookmarks: '1000', search_target: 'partial_match_for_tags' });
    if (pixiv.search.nextURL) illusts = await pixiv.util.multiCall({ next_url: pixiv.search.nextURL, illusts });

    // filter out all r18 illusts
    let clean_illusts = illusts.filter((illust) => {
        return illust.x_restrict === 0 && illust.total_bookmarks >= 1000;
    });
    fs.writeFileSync('./data/illusts.json', JSON.stringify(clean_illusts));
    return;
}

function processIllustURL(illust: PixivIllust): string[] {
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

export function generateIllustEmbed(illust: PixivIllust): MessageEmbed[] {
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
        .setDescription(illust?.caption
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

export async function sendSuggestedIllust(channel: TextChannel) {
    const pixiv = await Pixiv.refreshLogin(refreshToken);
    let following = await pixiv.user.following({ user_id: 43790997 });
    let authors = following.user_previews
    if (pixiv.user.nextURL) authors = await pixiv.util.multiCall( { next_url: pixiv.user.nextURL, user_previews: authors });
    const randomAuthor = authors[Math.floor(Math.random() * authors.length)];
    let illusts = randomAuthor.illusts;
    if (pixiv.illust.nextURL) illusts = await pixiv.util.multiCall({ next_url: pixiv.search.nextURL, illusts });
    let clean_illusts = illusts.filter((illust) => {
        return illust.x_restrict === 0 && illust.total_bookmarks >= 1000;
    });
    const randomIllust = clean_illusts[Math.floor(Math.random() * illusts.length)];
    const illustEmbed = generateIllustEmbed(randomIllust);
    return channel.send({ embeds: illustEmbed })
}

export async function extension(reaction: MessageReaction, attachment: string) {
    const imageLink = attachment.split('.');
    const typeOfImage = imageLink[imageLink.length - 1];
    const image = /(jpg|jpeg|png|gif)/gi.test(typeOfImage);
    if (!image) return '';
    return attachment;
}

export function getEditDistance(a: string, b: string) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = [];

    // increment along the first column of each row
    let i;
    for (i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    // increment each column in the first row
    let j;
    for (j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for (i = 1; i <= b.length; i++) {
        for (j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    // substitution
                    matrix[i - 1][j - 1] + 1,
                    Math.min(
                        matrix[i][j - 1] + 1,
                        // insertion
                        matrix[i - 1][j] + 1,
                    ),
                    // deletion
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

// get guild data from database or local json file, generate one if none found
export async function getGuildData(client: CustomClient, guildId: Snowflake) {
    let rawData;
    const collection = client.guildDatabase;
    const defaultData = {
        id: guildId,
        data: {
            language: 'zh-TW',
            snipes: [],
            editSnipes: [],
            users: [],
        },
    };
    if (collection) {
        rawData = await collection.findOne({ id: guildId });
    } else {
        const buffer = fs.readFileSync(`./data/guildData.json`, 'utf-8');
        const parsedJSON = JSON.parse(buffer);
        rawData = parsedJSON[guildId];
    }
    return rawData ?? defaultData;
}

// save guild data to database, or local json file
export async function saveGuildData(client: CustomClient, guildId: Snowflake) {
    const guildData = client.guildCollection.get(guildId); // collection cache
    const collection = client.guildDatabase; // database or json
    if (collection) {
        const query = { id: guildId };
        const options = { upsert: true };
        return collection.replaceOne(query, guildData, options); // save in mongodb
    } else {
        const rawData = fs.readFileSync(`./data/guildData.json`, 'utf-8');
        const guildCollection = JSON.parse(rawData);
        guildCollection[guildId] = guildData;
        return fs.writeFileSync(`./data/guildData.json`, JSON.stringify(guildCollection)); // save in json
    }
}

export async function deleteGuildData(client: CustomClient, guildId: Snowflake) {
    const collection = client.guildDatabase;
    client.guildCollection.delete(guildId);
    if (collection) {
        const query = { id: guildId };
        return collection.deleteOne(query)
    } else {
        const rawData = fs.readFileSync(`./data/guildData.json`, 'utf-8');
        const guildCollection = JSON.parse(rawData);
        delete guildCollection[guildId];
        return fs.writeFileSync(`./data/guildData.json`, JSON.stringify(guildCollection)); // save in json
    }
}

// get user data from database or local json file, generate one if none found
export async function getUserData(client: CustomClient, member: GuildMember) {
    let rawData;
    const collection = client.guildDatabase;
    const defaultData = {
        id: member.id,
        name: member.user.tag,
        exp: 0,
        level: 1,
    };
    if (collection) {
        rawData = await collection.findOne({ id: member.guild.id });
    } else {
        const buffer = fs.readFileSync(`./data/guildData.json`, 'utf-8');
        const parsedJSON = JSON.parse(buffer);
        rawData = parsedJSON[member.guild.id];
    }
    const userList = rawData.data.users;
    const userData = userList?.find((user) => user.id === member.id);
    if (!userData) {
        client.guildCollection.get(member.guild.id).data.users.push(defaultData); // create a new profile
    }
    return userList?.find(user => user.id === member.id) ?? defaultData;
}

// add exp for a user
export async function addUserExp(client: CustomClient, member: GuildMember) {
    const guildData = client.guildCollection.get(member.guild.id);
    const userData = guildData.data.users.find(user => user.id === member.id); // collection cache
    const levelRewards = guildData.data.levelReward;
    let exp = userData.exp;
    let level = userData.level;
    exp ++;
    if (userData.exp >= level * ((1 + level) / 2) + 4 ) { // level up
        level ++;
        if (levelRewards) {
            for (const [rewardLevel, reward] of Object.entries(levelRewards)) {
                if (level >= parseInt(rewardLevel) && !member.roles.cache.has(reward)) await member.roles.add(reward);
            }
        }
        exp = 0
    }
    userData.exp = exp;
    userData.level = level;
    userData['expAddTimestamp'] = Date.now();
    guildData.data.users.sort((a, b) => {
        if (a.level === b.level) return (b.exp - a.exp);
        return (b.level - a.level);
    })
    await saveGuildData(client, member.guild.id);
}