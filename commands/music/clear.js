const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const { checkStats } = require('../../functions/musicFunctions');
const commandReply = new CommandReply();
function clear(command, language) {
    const serverQueue = checkStats(command, language);
    if (serverQueue === 'error') return;

    serverQueue.songs.splice(1);
    return commandReply.reply(command, language.cleared, 'RED');
}
module.exports = {
    name: 'clear',
    guildOnly: true,
    description: true,
    execute(message, _args, language) {
        clear(message, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder(),
        execute(interaction, language) {
            clear(interaction, language);
        },
    },
};