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
    description: {
        'en_US': 'Bulk delete messages.',
        'zh_CN': '删除多条讯息',
        'zh_TW': '刪除多條訊息',
    },
    async execute(message, args, language) {
        await prune(message, args, language);
    },
    options: [
        {
            name: 'number',
            description: {
                'en_US': 'Number of messages to prune',
                'zh_CN': '批量删除的讯息数量',
                'zh_TW': '批量刪除的訊息數量',
            },
            type: 'INTEGER',
            required: true,
        },
    ],
    slashCommand: {
        async execute(interaction, language) {
            await prune(interaction, [interaction.options.getInteger('number')], language);
        },
    },
};
