import {
    SlashCommandBuilder,
    SlashCommandIntegerOption,
    SlashCommandStringOption,
    SlashCommandSubcommandBuilder,
    SlashCommandSubcommandGroupBuilder
} from "@discordjs/builders";

import {
    ColorResolvable,
    CommandInteraction,
    InteractionReplyOptions,
    Message,
    MessageEmbed,
    MessageOptions, MessageReaction
} from "discord.js";

import Pixiv from "pixiv.ts";
import * as fs from "fs";
const refreshToken = process.env.PIXIV_REFRESH_TOKEN || require('../config/config.json').PixivRefreshToken;

interface SlashCommand {
    execute(interaction, language): any;
    autoComplete?(interaction): Promise<void>,
}

interface Description {
    'en_US': string,
    'zh_CN': string,
    'zh_TW': string,
}

interface SubcommandOptions {
    name: string,
    description: Description,
    type: 'STRING' | 'INTEGER' | 'BOOLEAN' | 'NUMBER' | 'USER' | 'CHANNEL' | 'ROLE' | 'MENTIONABLE',
    required?: boolean,
    choices?: [name: string, value: string][],
    min?: number,
    max?: number,
    autocomplete?: boolean
}

interface Subcommand {
    name: string,
    description: Description,
    options?: SubcommandOptions[],
}

interface SubcommandGroup {
    name: string,
    description: Description,
    subcommands: Subcommand[],
}

interface Command {
    name: string,
    coolDown: number,
    slashCommand: SlashCommand,
    description: Description,
    subcommandGroups?: SubcommandGroup[],
    subcommands?: Subcommand[],
    options?: SubcommandOptions[],
}

type language = 'en_US' | 'zh_CN' | 'zh_TW';

// process command objects
export function processCommand(command: Command, language: language) {
    if (command.slashCommand) {
        const data = new SlashCommandBuilder();
        data.setName(command.name);
        data.setDescription(command.description[language] ?? 'none');
        processData(data, command, language);
        return data;
    }
}

function processOpt(commandBuilder: SlashCommandSubcommandBuilder | SlashCommandBuilder, opt: SubcommandOptions, language: language) {
    switch (opt.type) {
        case "STRING":
            const stringOptionBuilder = new SlashCommandStringOption()
                .setName(opt.name)
                .setDescription(opt.description[language])
                .setRequired(opt.required ?? false)
            if (opt.autocomplete) stringOptionBuilder.setAutocomplete(opt.autocomplete);
            if (opt.choices) stringOptionBuilder.setChoices(opt.choices);
            commandBuilder.addStringOption(stringOptionBuilder);
            break;
        case "INTEGER":
            const integerOptionBuilder = new SlashCommandIntegerOption()
                .setName(opt.name)
                .setDescription(opt.description[language])
            if (opt.min) integerOptionBuilder.setMinValue(opt.min)
            if (opt.max) integerOptionBuilder.setMaxValue(opt.max)
            commandBuilder.addIntegerOption(integerOptionBuilder);
            break;
        case "BOOLEAN":
            commandBuilder.addBooleanOption(option =>
                option.setName(opt.name)
                    .setDescription(opt.description[language])
                    .setRequired(opt.required ?? false)
            )
            break;
        case "NUMBER":
            commandBuilder.addNumberOption(option =>
                option.setName(opt.name)
                    .setDescription(opt.description[language])
                    .setRequired(opt.required ?? false)
            )
            break;
        case "USER":
            commandBuilder.addUserOption(option =>
                option.setName(opt.name)
                    .setDescription(opt.description[language])
                    .setRequired(opt.required ?? false)
            )
            break;
        case "CHANNEL":
            commandBuilder.addChannelOption(option =>
                option.setName(opt.name)
                    .setDescription(opt.description[language])
                    .setRequired(opt.required ?? false)
            )
            break;
        case "ROLE":
            commandBuilder.addRoleOption(option =>
                option.setName(opt.name)
                    .setDescription(opt.description[language])
                    .setRequired(opt.required ?? false)
            )
            break;
        case "MENTIONABLE":
            commandBuilder.addMentionableOption(option =>
                option.setName(opt.name)
                    .setDescription(opt.description[language])
                    .setRequired(opt.required ?? false)
            )
            break;
    }
    if (commandBuilder instanceof SlashCommandSubcommandBuilder) return commandBuilder;
    return;
}

function processData(data: SlashCommandBuilder, command: Command, language: language) {
    if (command.subcommandGroups) {
        command.subcommandGroups.forEach(group => {
            const subcommandGroupBuilder = new SlashCommandSubcommandGroupBuilder()
                .setName(group.name)
                .setDescription(group.description[language]);
            group.subcommands.forEach(sub => {
                let subcommandBuilder = new SlashCommandSubcommandBuilder()
                    .setName(sub.name)
                    .setDescription(sub.description[language]);
                sub.options.forEach(opt => {
                    subcommandBuilder = processOpt(subcommandBuilder, opt, language);
                });
                subcommandGroupBuilder.addSubcommand(subcommandBuilder);
            });
            data.addSubcommandGroup(subcommandGroupBuilder);
        });
    }
    if (command.subcommands) {
        command.subcommands.forEach(sub => {
            let subcommandBuilder = new SlashCommandSubcommandBuilder()
                .setName(sub.name)
                .setDescription(sub.description[language]);
            sub.options.forEach(opt => {
                subcommandBuilder = processOpt(subcommandBuilder, opt, language);
            });
            data.addSubcommand(subcommandBuilder)
        });
    }
    if (command.options) {
        command.options.forEach(opt => {
            processOpt(data, opt, language);
        });
    }
}

// reply with embeds, combine interaction and message commands together
// check if something is string
function isString(x: any): x is string {
    return typeof x === "string";
}

// reply to a user command
export async function reply(command: Message | CommandInteraction, response: string | MessageOptions | InteractionReplyOptions, color?: ColorResolvable) {
    if (isString(response)) {
        if (command instanceof Message) {
            return command.reply({ embeds: [{ description: response, color: color }] });
        }
        if (command.deferred) {
            await command.editReply({ embeds: [{ description: response, color: color }] });
            return await command.fetchReply();
        }
        await command.reply({ embeds: [{ description: response, color: color }] });
        return await command.fetchReply();
    }
    if (command instanceof Message) return command.reply(response);
    if (command.deferred) return await command.editReply(response);
    await command.reply(response);
    return await command.fetchReply();
}

// edit a message or interaction
export async function edit(command: Message | CommandInteraction, response?: MessageEmbed | string | MessageOptions | InteractionReplyOptions, color?: ColorResolvable) {
    if (command instanceof Message) {
        if (response instanceof MessageEmbed) return await command.edit({ embeds: [response], components: [], content: '\u200b' });
        else if (isString(response)) return await command.edit({ embeds: [{ description: response, color: color }], components: [], content: '\u200b' });
        return await command.edit(response);
    }
    if (response instanceof MessageEmbed) return await command.editReply({ embeds: [response], components: [], content: '\u200b' });
    else if (isString(response)) return await command.editReply( { embeds: [{ description: response, color: color }], components: [], content: '\u200b' });
    return await command.editReply(response);
}

export async function error(command: Message | CommandInteraction, response: string | MessageOptions | InteractionReplyOptions) {
    return await reply(command, `❌ | ${response}`, 'RED');
}

export async function warn(command: Message | CommandInteraction, response: string | MessageOptions | InteractionReplyOptions) {
    return await reply(command, `⚠ | ${response}`, 'YELLOW');
}

export async function success(command: Message | CommandInteraction, response: string | MessageOptions | InteractionReplyOptions) {
    return await reply(command, `✅ | ${response}`, 'GREEN');
}

export async function info(command: Message | CommandInteraction, response: string | MessageOptions | InteractionReplyOptions) {
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