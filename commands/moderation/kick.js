const { SlashCommandBuilder } = require('@discordjs/builders');
const { reply } = require('../../functions/commandReply.js');

async function kick(command, taggedUser, language) {
    if (!taggedUser) return reply(command, language.noMention, 'YELLOW');
    if (taggedUser.id === command.author.id) return reply(command, language.cantKickSelf, 'RED');
    if (!taggedUser.kickable) return reply(command, language.cannotKick, 'RED');
    await taggedUser.kick();
    return reply(command, command.kickSuccess.replace('${taggedUser.user.username}', taggedUser.user.username), 'GREEN');
}

module.exports = {
    name: 'kick',
    description: {
        'en_US': 'Kick a server member out',
        'zh_CN': '踢出群组成员',
        'zh_TW': '踢出群組成員',
    },
    guildOnly: true,
    usage: '[mention]',
    permissions: 'ADMINISTRATOR',
    async execute(message) {
        await kick(message, message.mentions.members.first());
    },
    slashCommand: {
        data: new SlashCommandBuilder()
            .addUserOption((option) =>
                option.setName('member')
                    .setDescription('Member to kick')
                    .setRequired(true)),
        async execute(interaction, language) {
            await kick(interaction, interaction.options.getUser('member'), language);
        },
    },
};
