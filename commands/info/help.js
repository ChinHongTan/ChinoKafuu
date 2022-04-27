const { error } = require('../../functions/Util.js');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const prefix = process.env.PREFIX || require('../../config/config.json').prefix;

function createSelectMenu() {
    const commandCategories = fs.readdirSync('./commands');
    const component = new MessageSelectMenu()
        .setCustomId('help')
        .setPlaceholder('Browse Commands');
    const selectMenuOptions = [];
    for (const name of commandCategories) {
        selectMenuOptions.push({
            label: name,
            description: name,
            value: name,
        });
    }
    component.addOptions(selectMenuOptions);
    return new MessageActionRow()
        .addComponents(component);
}

async function createHelpEmbed(interaction, language, folder, languageStr) {
    const embed = new MessageEmbed()
        .setTitle(language.helpTitle)
        .setDescription(`${language.helpPrompt}\n${language.helpPrompt2.replace('${prefix}', prefix)}`)
        .setColor('BLUE')
        .setThumbnail(interaction.client.user.displayAvatarURL());
    const commands = getCommands(folder);
    commands.forEach(command => {
        embed.addField(command.name ?? 'none', command.description?.[languageStr] ?? 'none', true);
        if (command.subcommandGroups) {
            command.subcommandGroups.forEach(subcommandGroup => {
                subcommandGroup.subcommands.forEach(subcommand => {
                    const name = `${command.name} ${subcommandGroup.name} ${subcommand.name}`;
                    embed.addField(name ?? 'none', subcommand.description?.[languageStr] ?? 'none', true);
                });
            });
        }
        if (command.subcommands) {
            command.subcommands.forEach(subcommand => {
                const name = `${command.name} ${subcommand.name}`;
                embed.addField(name ?? 'none', subcommand.description?.[languageStr] ?? 'none', true);
            });
        }
    });
    return embed;
}

function getCommands(folder) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter((file) => file.endsWith('.js'));
    return commandFiles.map(file => require(`../../commands/${folder}/${file}`));
}

function sendHelp(interaction, language, embed, row) {
    return interaction.reply({ split: true, embeds: [embed], components: [row] });
}

async function help(interaction, args, language, languageStr) {
    const { commands } = interaction.client;
    if (!args.length) {
        const embed = new MessageEmbed()
            .setTitle(language.helpTitle)
            .setDescription(`${language.helpPrompt}\n${language.helpPrompt2.replace('${prefix}', prefix)}`)
            .setColor('BLUE')
            .setThumbnail(interaction.client.user.displayAvatarURL());

        const row = createSelectMenu();
        return sendHelp(interaction, language, embed, row);
    }

    const name = args[0].split(' ')[0].toLowerCase(); // only takes the command name
    const command = commands.get(name) || commands.find((c) => c?.aliases?.includes(name));

    if (!command) return error(interaction, language.invalidCmd);
    const embed = new MessageEmbed()
        .setTitle(`**${command.name}**`)
        .setThumbnail(interaction.client.user.displayAvatarURL())
        .setColor('BLUE')
        .addField(language.cmdName, command.name, true)
        .addField(language.cmdAliases, command?.aliases?.join(', ') || 'None', true)
        .addField(language.cmdDescription, command.description?.[languageStr] ?? 'none')
        .addField(language.cmdUsage, `${prefix}${command.name} ${command.usage || ''}`, true)
        .addField(language.cmdCoolDown, `${command.coolDown || 3}`, true);
    if (command.subcommandGroups) {
        command.subcommandGroups.forEach(subcommandGroup => {
            subcommandGroup.subcommands.forEach(subcommand => {
                const subcommandName = `${command.name} ${subcommandGroup.name} ${subcommand.name}`;
                embed.addField(subcommandName ?? 'none', subcommand.description?.[languageStr] ?? 'none');
            });
        });
    }
    if (command.subcommands) {
        command.subcommands.forEach(subcommand => {
            const subcommandName = `${command.name} ${subcommand.name}`;
            embed.addField(subcommandName ?? 'none', subcommand.description?.[languageStr] ?? 'none');
        });
    }
    return interaction.reply({ split: true, embeds: [embed] });
}
module.exports = {
    name: 'help',
    description: {
        'en_US': 'List all of my commands or info about a specific command.',
        'zh_CN': '列出我所有的指令/單個的指令详情',
        'zh_TW': '列出我所有的指令/單個的指令詳情',
    },
    options: [
        {
            name: 'command',
            description: {
                'en_US': 'Help for a specific command',
                'zh_CN': '特定指令的帮助',
                'zh_TW': '特定指令的幫助',
            },
            type: 'STRING',
        },
    ],
    aliases: ['commands'],
    usage: '[command name]',
    coolDown: 5,
    execute(message, args, language) {
        const languageStr = message.client.guildCollection.get(message.guild.id).options.language;
        return help(message, args, language, languageStr);
    },
    slashCommand: {
        execute(interaction, language) {
            const optionContent = interaction.options.getString('command');
            const languageStr = interaction.client.guildCollection.get(interaction.guild.id).options.language;
            return help(interaction, optionContent ? [optionContent] : [], language, languageStr);
        },
        async selectMenu(interaction, language) {
            if (interaction.customId !== 'help') return;
            const row = createSelectMenu();
            const languageStr = interaction.client.guildCollection.get(interaction.guild.id).options.language;
            const embed = await createHelpEmbed(interaction, language, interaction.values[0], languageStr);
            return interaction.update({ embeds: [embed], components: [row] });
        },
    },
};
