const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const { MessageEmbed } = require("discord.js");
const commandReply = new CommandReply();
function server(command) {
    const embed = new MessageEmbed()
        .setTitle('Server Info')
        .setThumbnail(command.guild.iconURL())
        .setDescription(`Information about ${command.guild.name}`)
        .setColor('BLUE')
        .setAuthor(`${command.guild.name} Info`, command.guild.iconURL())
        .addFields(
            { name: 'Server name', value: command.guild.name, inline: true },
            { name: 'Server owner', value: command.guild.owner, inline: true },
            { name: 'Member count', value: command.guild.memberCount, inline: true },
            { name: 'Region', value: command.guild.region, inline: true },
            { name: 'Hightst role', value: command.guild.roles.highest, inline: true },
            { name: 'Server creation', value: command.guild.createdAt, inline: true },
            { name: 'Channels count', value: command.guild.channels.cache.size, inline: true },
        )
        .setFooter('ChinoKafuu | Server Info', command.client.user.displayAvatarURL());
    commandReply.reply(command, embed);
}
module.exports = {
    name: 'server',
    aliases: ['server-info'],
    description: 'Information about server.',
    guildOnly: true,
    cooldown: 5,
    execute(message) {
        server(message);
    },
    slashCommand: {
        data: new SlashCommandBuilder(),
        async execute(interaction, language) {
            await server(interaction, language);
        },
    },
};
