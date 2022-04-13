const { SlashCommandBuilder } = require('@discordjs/builders');
const { reply } = require('../../functions/commandReply.js');
const { checkStats } = require('../../functions/musicFunctions');
async function resume(command, language) {
    const serverQueue = await checkStats(command, language);
    if (serverQueue === 'error') return;

    if (serverQueue) {
        if (serverQueue.playing) return reply(command, 'I am already playing!', 'RED');
        serverQueue.player.unpause();
        serverQueue.playing = true;
        return reply(command, 'Resumed!', 'GREEN');
    }
}
module.exports = {
    name: 'resume',
    guildOnly: true,
    description: true,
    execute(message, _args, language) {
        return resume(message, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder(),
        execute(interaction, language) {
            return resume(interaction, language);
        },
    },
};
