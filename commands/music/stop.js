const { SlashCommandBuilder } = require('@discordjs/builders');
const { reply } = require('../../functions/commandReply.js');
const { checkStats } = require('../../functions/musicFunctions');
function stop(command, language) {
    const serverQueue = checkStats(command, language);
    if (serverQueue === 'error') return;

    serverQueue.songs = [];
    serverQueue.player.stop();
    return reply(command, language.stopped, 'BLUE');
}
module.exports = {
    name: 'stop',
    guildOnly: true,
    description: true,
    async execute(message, _args, language) {
        await stop(message, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder(),
        async execute(interaction, language) {
            await stop(interaction, language);
        },
    },
};
