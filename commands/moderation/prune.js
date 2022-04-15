const { SlashCommandBuilder } = require('@discordjs/builders');
const { reply } = require('../../functions/commandReply.js');
function prune(command, args, language) {
    const amount = parseInt(args[0]) + 1;

    if (isNaN(amount)) {
        return reply(command, language.invalidNum, 'RED');
    } if (amount <= 2 || amount > 100) {
        return reply(command, language.notInRange, 'RED');
    }

    command.channel.bulkDelete(amount, true).catch((err) => {
        console.error(err);
        return reply(command, language.pruneError, 'RED');
    });
}
module.exports = {
    name: 'prune',
    aliases: ['cut', 'delete', 'del'],
    guildOnly: true,
    permissions: 'MANAGE_MESSAGES',
    description: {
        'en_US': 'Bulk delete messages.',
        'zh_CN': '删除多条讯息',
        'zh_TW': '刪除多條訊息',
    },
    async execute(message, args, language) {
        await prune(message, args, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder()
            .addIntegerOption((option) =>
                option.setName('number')
                    .setDescription('Number of messages to prune')
                    .setRequired(true)),
        async execute(interaction, language) {
            await prune(interaction, [interaction.options.getInteger('number')], language);
        },
    },
};
