const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const { CommandInteraction } = require('discord.js');
const commandReply = new CommandReply();

async function mute(command, args = []) {
    if (!command.member.permissions.has('MANAGE_ROLES')) return commandReply.edit(command, '**You Dont Have Permissions To Mute Someone! - [MANAGE_GUILD]**', 'RED');
    if (!command.guild.me.permissions.has('MANAGE_ROLES')) return commandReply.edit(command, '**I Don\'t Have Permissions To Mute Someone! - [MANAGE_GUILD]**', 'RED');
    const collection = command.client.guildOptions;

    const taggedUser = command instanceof CommandInteraction ? args[0] : command.mentions.members.first();
    if (!taggedUser) return commandReply.edit(command, ':warning: | You need to tag a user in order to mute them!', 'YELLOW');
    if (taggedUser.user.bot) return commandReply.edit(command, ':warning: | You can\'t mute bots!', 'YELLOW');
    if (taggedUser.id === command.member.user.id) return commandReply.edit(command, ':x: | You Cannot Mute Yourself!', 'RED');
    if (taggedUser.permissions.has('ADMINISTRATOR')) return commandReply.edit(command, ':x: | You cannot mute an admin!', 'RED');
    if (taggedUser.roles.highest.comparePositionTo(command.guild.me.roles.highest) >= 0 && (taggedUser.roles)) {
        return commandReply.edit(command, 'Cannot Mute This User!', 'RED');
    }

    const guildOption = await collection.findOne({ id: command.guild.id }) ?? { id: command.guild.id, options: {} };
    let muteRole = guildOption.options['muteRole'];
    if (!muteRole) {
        try {
            muteRole = await command.guild.roles.create({
                name: 'muted',
                color: '#514f48',
                permissions: [],
            });
            for (const channel of command.guild.channels.cache.values()) {
                await channel.permissionOverwrites.create(muteRole, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false,
                    SPEAK: false,
                    CONNECT: false,
                });
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    guildOption.options['muteRole'] = muteRole;
    if (taggedUser.roles.cache.has(muteRole.id)) return commandReply.edit(command, ':x: | User is already muted!', 'RED');
    await taggedUser.roles.set([muteRole]);
    args.shift();
    const reason = args[0] ? args.join(' ') : 'None';
    const query = { id: command.guild.id };
    const options = { upsert: true };
    await collection.replaceOne(query, guildOption, options);
    await commandReply.edit(command, `Successfully Muted: ${taggedUser.user.username}! Reason: ${reason}`, 'GREEN');
}
module.exports = {
    name: 'mute',
    description: 'Mute a server member.',
    guildOnly: true,
    usage: '[mention] [reason(optional)]',
    permissions: 'ADMINISTRATOR',
    async execute(message) {
        await mute(message);
    },
    slashCommand: {
        data: new SlashCommandBuilder()
            .addUserOption((option) =>
                option.setName('member')
                    .setDescription('Member to mute')
                    .setRequired(true))
            .addStringOption((option) =>
                option.setName('reason')
                    .setDescription('Reason')),
        async execute(interaction, language) {
            await interaction.deferReply();
            await mute(interaction, [interaction.options.getMember('member'), interaction.options.getString('reason')], language);
        },
    },
};