import {
    ColorResolvable,
    CommandInteraction, GuildMember,
    InteractionReplyOptions,
    Message,
    MessageEmbed,
    Snowflake, TextChannel
} from "discord.js";

import Pixiv, { PixivIllust } from "pixiv.ts";
import * as fs from "fs";
import { CustomClient, CustomMessageReaction } from "../../typings";

const refreshToken = process.env.PIXIV_REFRESH_TOKEN || require('../config/config.json').PixivRefreshToken;

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
export async function edit(command: CommandInteraction, response: string | InteractionReplyOptions | MessageEmbed, color?: ColorResolvable) {
    if (isString(response)) return await command.editReply({ embeds: [{ description: response, color: color }], components: [], content: '\u200b' });
    if (response instanceof MessageEmbed) return await command.editReply({ embeds: [response], components: [], content: '\u200b' });
    return await command.editReply(response);
}

export async function error(command: CommandInteraction, response: string) {
    const message = await reply(command, `❌ | ${response}`, 'RED');
    if (message instanceof Message) {
        setTimeout(() => message.delete(), 10000);
    }
}

export async function warn(command: CommandInteraction, response: string) {
    return await reply(command, `⚠ | ${response}`, 'YELLOW');
}

export async function success(command: CommandInteraction, response: string) {
    return await reply(command, `✅ | ${response}`, 'GREEN');
}

export async function info(command: CommandInteraction, response: string) {
    return await reply(command, `ℹ | ${response}`, 'BLUE')
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
    const targetURL: string[] = [];
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
    const multipleIllusts: MessageEmbed[] = [];

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
    if (pixiv.illust.nextURL) illusts = await pixiv.util.multiCall({ next_url: pixiv.illust.nextURL, illusts }); // not sure how this works, will remove comment after test
    let clean_illusts = illusts.filter((illust) => {
        return illust.x_restrict === 0 && illust.total_bookmarks >= 1000;
    });
    const randomIllust = clean_illusts[Math.floor(Math.random() * illusts.length)];
    const illustEmbed = generateIllustEmbed(randomIllust);
    return channel.send({ embeds: illustEmbed })
}

export async function extension(reaction: CustomMessageReaction, attachment: string) {
    const imageLink = attachment.split('.');
    const typeOfImage = imageLink[imageLink.length - 1];
    const image = /(jpg|jpeg|png|gif)/gi.test(typeOfImage);
    if (!image) return '';
    return attachment;
}

// get guild data from database or local json file, generate one if none found
export async function getGuildData(client: CustomClient, guildId: Snowflake) {
    let rawData: any;
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
    if (collection && guildData) {
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
        client.guildCollection.get(member.guild.id)?.data.users.push(defaultData); // create a new profile
    }
    return userList?.find(user => user.id === member.id) ?? defaultData;
}

// add exp for a user
export async function addUserExp(client: CustomClient, member: GuildMember) {
    const guildData = client.guildCollection.get(member.guild.id);
    if (!guildData) return; // should be initialised first in getGuildData()
    const userData = guildData.data.users.find(user => user.id === member.id); // collection cache
    if (!userData) return;  // should be initialised first in getUserData()
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