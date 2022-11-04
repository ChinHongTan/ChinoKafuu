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
            'en-US': 'Kick a server member out',
            'zh-CN': '踢出群组成员',
            'zh-TW': '踢出群組成員',
        })
        .addUserOption((option) => option
            .setName('member')
            .setDescriptionLocalizations({
                'en-US': 'Member to kick',
                'zh-CN': '要踢出的群员',
                'zh-TW': '要踢出的群員',
            })
            .setRequired(true),
        ),
    async execute(interaction, language) {
        await kick(interaction, interaction.options.getUser('member'), language);
    },
};
