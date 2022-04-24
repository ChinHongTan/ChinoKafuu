const { reply, error } = require('../../functions/Util.js');

function n(command, args, language) {
    if (args.length < 1) {
        return error(command, language.noNum);
    }
    return reply(command, `https://nhentai.net/g/${args[0]}/`, 'BLUE');
}
module.exports = {
    name: 'n',
    coolDown: 3,
    description: {
        'en_US': 'Get a nhentai link with given ID',
        'zh_CN': '用本本号码取得N网链接',
        'zh_TW': '用本本號碼取得N網鏈接',
    },
    options: [
        {
            name: 'id',
            description: {
                'en_US': '6 digit Nhentai ID',
                'zh_CN': '6位数N网号码',
                'zh_TW': '6位數N網號碼',
            },
            type: 'INTEGER',
            required: true,
        },
    ],
    execute(message, args, language) {
        return n(message, args, language);
    },
    slashCommand: {
        execute(interaction, language) {
            return n(interaction, [interaction.options.getInteger('id')], language);
        },
    },
};
