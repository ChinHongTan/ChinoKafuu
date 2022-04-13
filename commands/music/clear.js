const { SlashCommandBuilder } = require('@discordjs/builders');
const { reply } = require('../../functions/commandReply.js');
const { checkStats } = require('../../functions/musicFunctions');
function clear(command, language) {
    const serverQueue = checkStats(command, language);
    if (serverQueue === 'error') return;

    serverQueue.songs.splice(1);
    return reply(command, language.cleared, 'RED');
}
module.exports = {
    name: 'clear',
    guildOnly: true,
    description: true,
    execute(message, _args, language) {
        return clear(message, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder(),
        execute(interaction, language) {
            return clear(interaction, language);
        },
    },
};