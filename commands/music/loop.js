const { SlashCommandBuilder } = require('@discordjs/builders');
const { reply } = require('../../functions/commandReply.js');
const { checkStats } = require('../../functions/musicFunctions');
function loop(command, language) {
    const serverQueue = checkStats(command, language);
    if (serverQueue === 'error') return;

    if (serverQueue) {
        serverQueue.loop = !serverQueue.loop;
        if (serverQueue.loopQueue) serverQueue.loopQueue = false;
        return reply(command, serverQueue.loop ? 'Loop mode on!' : 'Loop mode off!', 'GREEN');
    }
}
module.exports = {
    name: 'loop',
    guildOnly: true,
    description: true,
    execute(message, _args, language) {
        return loop(message, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder(),
        async execute(interaction, language) {
            return loop(interaction, language);
        },
    },
};
