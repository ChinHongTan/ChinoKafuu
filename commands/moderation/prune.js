const { SlashCommandBuilder } = require('@discordjs/builders');
const { error } = require('../../functions/Util.js');
function prune(command, args, language) {
    const amount = parseInt(args[0]) + 1;

    if (isNaN(amount)) {
        return error(command, language.invalidNum);
    } if (amount <= 2 || amount > 100) {
        return error(command, language.notInRange);
    }

    command.channel.bulkDelete(amount, true).catch((err) => {
        console.error(err);
        return error(command, language.pruneError);
    });
}
module.exports = {
    name: 'prune',
    aliases: ['cut', 'delete', 'del'],
    guildOnly: true,
    permissions: 'MANAGE_MESSAGES',
    data: new SlashCommandBuilder()
        .setName('prune')
        .setDescription('刪除多條訊息')
        .setDescriptionLocalizations({
            'en-US': 'Bulk delete messages.',
            'zh-CN': '删除多条讯息',
            'zh-TW': '刪除多條訊息',
        })
        .addIntegerOption((option) => option
            .setName('number')
            .setDescription('批量刪除的訊息數量')
            .setDescriptionLocalizations({
                'en-US': 'Number of messages to prune.',
                'zh-CN': '批量删除的讯息数量',
                'zh-TW': '批量刪除的訊息數量',
            })
            .setRequired(true),
        ),
    async execute(interaction, language) {
        await prune(interaction, [interaction.options.getInteger('number')], language);
    },
};
