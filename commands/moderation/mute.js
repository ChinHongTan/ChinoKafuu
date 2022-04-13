const { SlashCommandBuilder } = require('@discordjs/builders');
const { reply } = require('../../functions/commandReply.js');

async function mute(command, [taggedUser, reason]) {
    if (!command.member.permissions.has('MANAGE_ROLES')) return reply(command, '**You Dont Have Permissions To Mute Someone! - [MANAGE_GUILD]**', 'RED');
    if (!command.guild.me.permissions.has('MANAGE_ROLES')) return reply(command, '**I Don\'t Have Permissions To Mute Someone! - [MANAGE_GUILD]**', 'RED');
    const collection = command.client.guildOptions;

    if (!taggedUser) return reply(command, ':warning: | You need to tag a user in order to mute them!', 'YELLOW');
    if (taggedUser.user.bot) return reply(command, ':warning: | You can\'t mute bots!', 'YELLOW');
    if (taggedUser.id === command.member.user.id) return reply(command, ':x: | You Cannot Mute Yourself!', 'RED');
    if (taggedUser.permissions.has('ADMINISTRATOR')) return reply(command, ':x: | You cannot mute an admin!', 'RED');
    if (taggedUser.roles.highest.comparePositionTo(command.guild.me.roles.highest) >= 0 && (taggedUser.roles)) {
        return reply(command, 'Cannot Mute This User!', 'RED');
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
        } catch (e) {
            console.log(e);
        }
    }
    guildOption.options['muteRole'] = muteRole;
    if (taggedUser.roles.cache.has(muteRole.id)) return reply(command, ':x: | User is already muted!', 'RED');
    await taggedUser.roles.set([muteRole]);
    const query = { id: command.guild.id };
    const options = { upsert: true };
    await collection.replaceOne(query, guildOption, options);
    return reply(command, `Successfully Muted: ${taggedUser.user.username}! Reason: ${reason}`, 'GREEN');
}
module.exports = {
    name: 'mute',
    description: 'Mute a server member.',
    guildOnly: true,
    usage: '[mention] [reason(optional)]',
    permissions: 'ADMINISTRATOR',
    async execute(message, args) {
        args.shift();
        const reason = args[0] ? args.join(' ') : 'None';
        await mute(message, [message.mentions.members.first(), reason]);
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
        async execute(interaction) {
            await interaction.deferReply();
            await mute(interaction, [interaction.options.getMember('member'), interaction.options.getString('reason')]);
        },
    },
};