const { error, success } = require('../../functions/Util.js');

async function kick(command, taggedUser, language) {
    if (!taggedUser) return error(command, language.noMention);
    if (taggedUser.id === command.author.id) return error(command, language.cantKickSelf);
    if (!taggedUser.kickable) return error(command, language.cannotKick);
    await taggedUser.kick();
    return success(command, command.kickSuccess.replace('${taggedUser.user.username}', taggedUser.user.username));
}

module.exports = {
    name: 'kick',
    description: {
        'en_US': 'Kick a server member out',
        'zh_CN': '踢出群组成员',
        'zh_TW': '踢出群組成員',
    },
    options: [
        {
            name: 'member',
            description: {
                'en_US': 'Member to kick',
                'zh_CN': '要踢出的群员',
                'zh_TW': '要踢出的群員',
            },
            type: 'USER',
            required: true,
        },
    ],
    guildOnly: true,
    usage: '[mention]',
    permissions: 'ADMINISTRATOR',
    async execute(message) {
        await kick(message, message.mentions.members.first());
    },
    slashCommand: {
        async execute(interaction, language) {
            await kick(interaction, interaction.options.getUser('member'), language);
        },
    },
};
