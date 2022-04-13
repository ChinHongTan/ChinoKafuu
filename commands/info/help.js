const { SlashCommandBuilder } = require('@discordjs/builders');
const { reply } = require('../../functions/commandReply.js');
const { MessageEmbed } = require('discord.js');

function sendHelp(user, interaction, language, embed) {
    return user
        .send({ split: true, embeds: [embed] })
        .then(() => {
            if (interaction.channel.type === 'dm') return;
            return reply(interaction, language.helpSend, 'GREEN');
        })
        .catch((error) => {
            console.error(`Could not send help DM to ${user.tag}.\n`, error);
            return reply(interaction, language.cantDM, 'RED');
        });
}

function help(interaction, args, language) {
    const prefix = process.env.PREFIX || require('../../config/config.json').prefix;
    const { commands } = interaction.client;
    if (!args.length) {
        const embed = new MessageEmbed()
            .setTitle(language.helpTitle)
            .setDescription(`${language.helpPrompt}\n${language.helpPrompt2.replace('${prefix}', prefix)}`)
            .setColor('BLUE')
            .setThumbnail(interaction.client.user.displayAvatarURL());
        commands.forEach((command) => {
            embed.addField(command.name ?? 'none', language[command.name] ?? 'none', true);
        });
        if (interaction.author) return sendHelp(interaction.author, interaction, language, embed);
        return sendHelp(interaction.user, interaction, language, embed);
    }

    const name = args[0].toLowerCase();
    const command = commands.get(name) || commands.find((c) => c.aliases && c.aliases.includes(name));

    if (!command) return reply(interaction, language.invalidcmd, 'RED');
    const embed = new MessageEmbed()
        .setTitle(`**${command.name}**`)
        .setThumbnail(interaction.client.user.displayAvatarURL())
        .setColor('BLUE')
        .addField(language.cmdName, command.name, true)
        .addField(language.cmdAliases, command?.aliases?.join(', ') || 'None', true)
        .addField(language.cmdDescription, language[command.name])
        .addField(language.cmdUsage, `${prefix}${command.name} ${command.usage || ''}`, true)
        .addField(language.cmdCooldown, `${command.cooldown || 3}`, true);
    return interaction.reply({ split: true, embeds: [embed] });
}
module.exports = {
    name: 'help',
    description: true,
    aliases: ['commands'],
    usage: '[command name]',
    cooldown: 5,
    execute(message, args, language) {
        help(message, args, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder()
            .addStringOption((option) => option.setName('command').setDescription('Help for a specific command')),
        execute(interaction, language) {
            const optionContent = interaction.options.getString('command');
            help(interaction, optionContent ? [optionContent] : [], language);
        },
    },
};
