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
    description: true,
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
