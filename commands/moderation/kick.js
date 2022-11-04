const { SlashCommandBuilder } = require('@discordjs/builders');
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
    guildOnly: true,
    usage: '[mention]',
    permissions: 'ADMINISTRATOR',
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescriptionLocalizations({
            'en_US': 'Kick a server member out',
            'zh_CN': '踢出群组成员',
            'zh_TW': '踢出群組成員',
        })
        .addUserOption((option) => option
            .setName('member')
            .setDescriptionLocalizations({
                'en_US': 'Member to kick',
                'zh_CN': '要踢出的群员',
                'zh_TW': '要踢出的群員',
            })
            .setRequired(true),
        ),
    async execute(interaction, language) {
        await kick(interaction, interaction.options.getUser('member'), language);
    },
};
