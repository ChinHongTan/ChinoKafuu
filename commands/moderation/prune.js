const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const commandReply = new CommandReply();
function prune(command, args, language) {
    const amount = parseInt(args[0]) + 1;

    if (isNaN(amount)) {
        return commandReply.reply(command, language.invalidNum, 'RED');
    } if (amount <= 2 || amount > 100) {
        return commandReply.reply(command, language.notInRange, 'RED');
    }

    command.channel.bulkDelete(amount, true).catch((err) => {
        console.error(err);
        return commandReply.reply(command, language.pruneError, 'RED');
    });
}
module.exports = {
    name: 'prune',
    aliases: ['cut', 'delete', 'del'],
    guildOnly: true,
    permissions: 'MANAGE_MESSAGES',
    description: true,
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
