"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
class Util {
    static processCommand(command, language) {
        var _a;
        if (command.slashCommand) {
            const data = new builders_1.SlashCommandBuilder();
            data.setName(command.name);
            data.setDescription((_a = command.description[language]) !== null && _a !== void 0 ? _a : 'none');
            this.processData(data, command, language);
            return data;
        }
    }
    static processOpt(commandBuilder, opt, language) {
        var _a;
        switch (opt.type) {
            case "STRING":
                const stringOptionBuilder = new builders_1.SlashCommandStringOption()
                    .setName(opt.name)
                    .setDescription(opt.description[language])
                    .setRequired((_a = opt.required) !== null && _a !== void 0 ? _a : false);
                if (opt.autocomplete)
                    stringOptionBuilder.setAutocomplete(opt.autocomplete);
                if (opt.choices)
                    stringOptionBuilder.setChoices(opt.choices);
                commandBuilder.addStringOption(stringOptionBuilder);
                break;
            case "INTEGER":
                const integerOptionBuilder = new builders_1.SlashCommandIntegerOption()
                    .setName(opt.name)
                    .setDescription(opt.description[language]);
                if (opt.min)
                    integerOptionBuilder.setMinValue(opt.min);
                if (opt.max)
                    integerOptionBuilder.setMaxValue(opt.max);
                commandBuilder.addIntegerOption(integerOptionBuilder);
                break;
            case "BOOLEAN":
                commandBuilder.addBooleanOption(option => {
                    var _a;
                    return option.setName(opt.name)
                        .setDescription(opt.description[language])
                        .setRequired((_a = opt.required) !== null && _a !== void 0 ? _a : false);
                });
                break;
            case "NUMBER":
                commandBuilder.addNumberOption(option => {
                    var _a;
                    return option.setName(opt.name)
                        .setDescription(opt.description[language])
                        .setRequired((_a = opt.required) !== null && _a !== void 0 ? _a : false);
                });
                break;
            case "USER":
                commandBuilder.addUserOption(option => {
                    var _a;
                    return option.setName(opt.name)
                        .setDescription(opt.description[language])
                        .setRequired((_a = opt.required) !== null && _a !== void 0 ? _a : false);
                });
                break;
            case "CHANNEL":
                commandBuilder.addChannelOption(option => {
                    var _a;
                    return option.setName(opt.name)
                        .setDescription(opt.description[language])
                        .setRequired((_a = opt.required) !== null && _a !== void 0 ? _a : false);
                });
                break;
            case "ROLE":
                commandBuilder.addRoleOption(option => {
                    var _a;
                    return option.setName(opt.name)
                        .setDescription(opt.description[language])
                        .setRequired((_a = opt.required) !== null && _a !== void 0 ? _a : false);
                });
                break;
            case "MENTIONABLE":
                commandBuilder.addMentionableOption(option => {
                    var _a;
                    return option.setName(opt.name)
                        .setDescription(opt.description[language])
                        .setRequired((_a = opt.required) !== null && _a !== void 0 ? _a : false);
                });
                break;
        }
        if (commandBuilder instanceof builders_1.SlashCommandSubcommandBuilder)
            return commandBuilder;
        return;
    }
    static processData(data, command, language) {
        if (command.subcommandGroups) {
            command.subcommandGroups.forEach(group => {
                const subcommandGroupBuilder = new builders_1.SlashCommandSubcommandGroupBuilder()
                    .setName(group.name)
                    .setDescription(group.description[language]);
                group.subcommands.forEach(sub => {
                    let subcommandBuilder = new builders_1.SlashCommandSubcommandBuilder()
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
                let subcommandBuilder = new builders_1.SlashCommandSubcommandBuilder()
                    .setName(sub.name)
                    .setDescription(sub.description[language]);
                sub.options.forEach(opt => {
                    subcommandBuilder = this.processOpt(subcommandBuilder, opt, language);
                });
                data.addSubcommand(subcommandBuilder);
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
//# sourceMappingURL=Util.js.map