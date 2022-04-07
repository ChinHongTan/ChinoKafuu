const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const commandReply = new CommandReply();
const { checkStats } = require('../../functions/musicFunctions');
function skip(command, language) {
    const serverQueue = checkStats(command, language);
    if (serverQueue === 'error') return;

    serverQueue.player.stop();
    return commandReply.reply(command, language.skipped, 'BLUE');
}
module.exports = {
    name: 'skip',
    guildOnly: true,
    aliases: ['next'],
    description: true,
    execute(message, _args, language) {
        skip(message, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder(),
        execute(interaction, language) {
            skip(interaction, language);
        },
    },
};
