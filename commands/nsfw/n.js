const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const commandReply = new CommandReply();

function n(command, args, language) {
    if (args.length < 1) {
        return commandReply.reply(command, language.noNum, 'RED');
    }
    return commandReply.reply(command, `https://nhentai.net/g/${args[0]}/`, 'BLUE');
}
module.exports = {
    name: 'n',
    cooldown: 3,
    description: true,
    execute(message, args, language) {
        n(message, args, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder()
            .addIntegerOption((option) =>
                option.setName('id')
                    .setDescription('Nhentai ID')
                    .setRequired(true)),
        execute(interaction, language) {
            n(interaction, [interaction.options.getInteger('id')], language);
        },
    },
};
