const { SlashCommandBuilder } = require('@discordjs/builders');
const { reply } = require('../../functions/commandReply.js');
const { checkStats } = require('../../functions/musicFunctions');
async function skip(command, language) {
    const serverQueue = await checkStats(command, language);
    if (serverQueue === 'error') return;

    serverQueue.player.stop();
    return reply(command, language.skipped, 'BLUE');
}
module.exports = {
    name: 'skip',
    guildOnly: true,
    aliases: ['next'],
    description: true,
    execute(message, _args, language) {
        return skip(message, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder(),
        execute(interaction, language) {
            return skip(interaction, language);
        },
    },
};
