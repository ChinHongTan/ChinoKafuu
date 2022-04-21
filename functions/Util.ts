import {
    SlashCommandBuilder,
    SlashCommandIntegerOption,
    SlashCommandStringOption,
    SlashCommandSubcommandBuilder,
    SlashCommandSubcommandGroupBuilder
} from "@discordjs/builders";

interface SlashCommand {
    data: SlashCommandBuilder,
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
    cooldown: number,
    slashCommand: SlashCommand,
    description: Description,
    subcommandGroups?: SubcommandGroup[],
    subcommands?: Subcommand[],
    options?: SubcommandOptions[],
}

type language = 'en_US' | 'zh_CN' | 'zh_TW';

class Util {
    public static processCommand(command: Command, language: language) {
        if (command.slashCommand) {
            const data = new SlashCommandBuilder();
            data.setName(command.name);
            data.setDescription(command.description[language] ?? 'none');
            this.processData(data, command, language);
            return data;
        }
    }

    private static processOpt(commandBuilder: SlashCommandSubcommandBuilder | SlashCommandBuilder, opt: SubcommandOptions, language: language) {
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

    private static processData(data: SlashCommandBuilder, command: Command, language: language) {
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
                        subcommandBuilder = this.processOpt(subcommandBuilder, opt, language);
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
                    subcommandBuilder = this.processOpt(subcommandBuilder, opt, language);
                });
                data.addSubcommand(subcommandBuilder)
            });
        }
        if (command.options) {
            command.options.forEach(opt => {
                this.processOpt(data, opt, language);
            });
        }
    }
}

module.exports = Util;
