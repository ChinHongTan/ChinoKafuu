const { error, success } = require('../../functions/Util.js');

async function ban(command, taggedUser, language) {
    if (!taggedUser) return error(command, language.noMention);
    if (taggedUser.id === command.author.id) return error(command, language.cantBanSelf);
    if (!taggedUser.bannable) return error(command, language.cannotBan);
    await command.guild.members.ban(taggedUser);
    return success(command, language.banSuccess.replace('${taggedUser.user.username}', taggedUser.user.username));
}

module.exports = {
    name: 'ban',
    description: {
        'en_US': 'Ban a server member',
        'zh_CN': '对群组成员停权',
        'zh_TW': '對群組成員停權',
    },
    options: [
        {
            name: 'member',
            description: {
                'en_US': 'Member to ban',
                'zh_CN': '要停权的群员',
                'zh_TW': '要停權的群員',
            },
            type: 'USER',
            required: true,
        },
    ],
    guildOnly: true,
    usage: '[mention]',
    permissions: 'ADMINISTRATOR',
    async execute(message, _, language) {
        await ban(message, message.mentions.members.first(), language);
    },
    slashCommand: {
        async execute(interaction, language) {
            await ban(interaction, interaction.options.getUser('member'), language);
        },
    },
};
