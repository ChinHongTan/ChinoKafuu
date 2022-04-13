const { SlashCommandBuilder } = require('@discordjs/builders');
const { reply } = require('../../functions/commandReply.js');
const { checkStats } = require('../../functions/musicFunctions');
async function pause(command, language) {
    const serverQueue = await checkStats(command, language, true);
    if (serverQueue === 'error') return;

    if (serverQueue) {
        serverQueue.player.pause(true);
        serverQueue.playing = false;
        return reply(command, language.pause, 'BLUE');
    }
}
module.exports = {
    name: 'pause',
    guildOnly: true,
    description: true,
    execute(message, _args, language) {
        return pause(message, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder(),
        execute(interaction, language) {
            return pause(interaction, language);
        },
    },
};
