import { SlashCommandBuilder } from "@discordjs/builders";
import { Guild, Client, Collection, Snowflake, Interaction, AutocompleteInteraction, SelectMenuInteraction, ButtonInteraction, PermissionResolvable } from "discord.js";
import { Collection as DB } from "mongodb";

export interface Translation {
    [key: string]: string;
}

export interface Command {
    name: string,
    coolDown: number,
    data: SlashCommandBuilder,
    ownerOnly: Boolean,
    guildOnly: Boolean,
    permissions: PermissionResolvable,
    execute(interaction: Interaction, args: string[], language: Translation): Promise<any>,
    autoComplete?: (interaction: AutocompleteInteraction) => Promise<void>,
    selectMenu?: (interaction: SelectMenuInteraction, language: Translation) => Promise<void>, // should change language to translate
    button?: (interaction: ButtonInteraction, language: Translation) => Promise<void>,
}

export interface Snipe {
    author: string,
    authorAvatar: string,
    content: string,
    timeStamp: Date,
    attachment?: string,
}

export interface CustomClient extends Client {
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
    userDatabase: DB,
}
export type Language = 'en-US' | 'zh-CN' | 'zh-TW';

export interface CustomGuild extends Omit<Guild, 'client'> {
    client: CustomClient
}