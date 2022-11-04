const { SlashCommandBuilder } = require('@discordjs/builders');
const { warn, error, success } = require('../../functions/Util.js');

async function mute(command, [taggedUser, reason]) {
    if (!command.member.permissions.has('MANAGE_ROLES')) return error(command, '**You Dont Have Permissions To Mute Someone! - [MANAGE_GUILD]**');
    if (!command.guild.me.permissions.has('MANAGE_ROLES')) return error(command, '**I Don\'t Have Permissions To Mute Someone! - [MANAGE_GUILD]**');
    const collection = command.client.guildOptions;

    if (!taggedUser) return warn(command, 'You need to tag a user in order to mute them!');
    if (taggedUser.user.bot) return warn(command, 'You can\'t mute bots!');
    if (taggedUser.id === command.member.user.id) return error(command, 'You Cannot Mute Yourself!');
    if (taggedUser.permissions.has('ADMINISTRATOR')) return error(command, 'You cannot mute an admin!');
    if (taggedUser.roles.highest.comparePositionTo(command.guild.me.roles.highest) >= 0 && (taggedUser.roles)) {
        return error(command, 'Cannot Mute This User!');
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
    if (taggedUser.roles.cache.has(muteRole.id)) return error(command, 'User is already muted!');
    await taggedUser.roles.set([muteRole]);
    const query = { id: command.guild.id };
    const options = { upsert: true };
    await collection.replaceOne(query, guildOption, options);
    return success(command, `Successfully Muted: ${taggedUser.user.username}! Reason: ${reason}`);
}
module.exports = {
    name: 'mute',
    guildOnly: true,
    usage: '[mention] [reason(optional)]',
    permissions: 'ADMINISTRATOR',
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescriptionLocalizations({
            'en_US': 'Mute a server member',
            'zh_CN': '禁言群组成员',
            'zh_TW': '禁言群組成員',
        })
        .addUserOption((option) => option
            .setName('member')
            .setDescriptionLocalizations({
                'en_US': 'Member to mute',
                'zh_CN': '要禁言的群员',
                'zh_TW': '要禁言的群員',
            })
            .setRequired(true),
        )
        .addStringOption((option) => option
            .setName('reason')
            .setDescriptionLocalizations({
                'en_US': 'Mute reason',
                'zh_CN': '禁言的原因',
                'zh_TW': '禁言的原因',
            }),
        ),
    async execute(interaction) {
        await interaction.deferReply();
        await mute(interaction, [interaction.options.getMember('member'), interaction.options.getString('reason')]);
    },
};