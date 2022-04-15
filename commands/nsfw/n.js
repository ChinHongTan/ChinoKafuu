const { SlashCommandBuilder } = require('@discordjs/builders');
const { reply } = require('../../functions/commandReply.js');

function n(command, args, language) {
    if (args.length < 1) {
        return reply(command, language.noNum, 'RED');
    }
    return reply(command, `https://nhentai.net/g/${args[0]}/`, 'BLUE');
}
module.exports = {
    name: 'n',
    cooldown: 3,
    description: {
        'en_US': 'Get a nhentai link with given ID',
        'zh_CN': '用本本号码取得N网链接',
        'zh_TW': '用本本號碼取得N網鏈接',
    },
    execute(message, args, language) {
        return n(message, args, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder()
            .addIntegerOption((option) =>
                option.setName('id')
                    .setDescription('Nhentai ID')
                    .setRequired(true)),
        execute(interaction, language) {
            return n(interaction, [interaction.options.getInteger('id')], language);
        },
    },
};
