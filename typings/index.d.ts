import { SlashCommandBuilder } from "@discordjs/builders";
import { Guild, Client, Collection, Snowflake, Interaction, AutocompleteInteraction, SelectMenuInteraction, ButtonInteraction, PermissionResolvable, Message, MessageReaction, CommandInteraction } from "discord.js";
import { Collection as DB } from "mongodb";
import { Tracing } from "trace_events";

export type Translation = Record<string, string>;

export interface Command {
    name: string,
    coolDown: number,
    data: SlashCommandBuilder,
    ownerOnly: Boolean,
    guildOnly: Boolean,
    permissions: PermissionResolvable,
    execute(interaction: Interaction, language: Translation): Promise<any>,
    autoComplete?: (interaction: AutocompleteInteraction) => Promise<void>,
    selectMenu?: (interaction: SelectMenuInteraction, language: Translation) => Promise<void>, // should change language to translate
    button?: (interaction: ButtonInteraction, language: Translation) => Promise<void>,
}

export interface Snipe {
    author: string,
    authorAvatar: string,
    content: string,
    timestamp: Date,
    attachment?: string,
}

export interface CustomClient extends Client {
    commands: Collection<string, Command>,
    language: Record<Language, { [commandName: string]: Translation }>,
    coolDowns: Collection<string, Collection<Snowflake, number>>,
    guildDatabase: DB,
    guildCollection: Collection<Snowflake, { id: Snowflake,
        data: {
            language: Language,
            channel?: Snowflake,
            levelReward?: { [level: number]: Snowflake },
            autoResponse?: { [message: string]: string[] },
            starboard?: Snowflake,
            snipes: Snipe[],
            editSnipes: Snipe[],
            users: {
                id: Snowflake,
                name: string,
                exp: number,
                level: number,
                expAddTimestamp?: number,
            }[],
    } }>
    userDatabase: DB,
}
export type Language = 'en-US' | 'zh-CN' | 'zh-TW';

export interface CustomGuild extends Omit<Guild, 'client'> {
    client: CustomClient;
}

export interface CustomMessage extends Omit<Message, 'client'> {
    client: CustomClient;
}

export interface CustomMessageReaction extends Omit<MessageReaction, 'client'> {
    client: CustomClient;
}

export interface CustomCommandInteraction extends Omit<CommandInteraction, 'client'> {
    client: CustomClient;
}

export type PixivBookmarks = '50' | '100' | '300' | '500' | '1000' | '3000' | '5000' | '10000';

interface TraceMoeResult {
    anilist: {
        id: number,
        idMal: number,
        title: { native: string, romaji: string, english?: string },
        synonyms: string[],
        isAdult: boolean,
    },
    filename: string,
    episode?: number | number[] | string,
    from: number,
    to: number,
    similarity: number,
    video: string,
    image: string,
}

export interface TraceMoeResponse {
    frameCound: number,
    error: string,
    result: TraceMoeResult[],
}