const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const commandReply = new CommandReply();
const { checkStats } = require('../../functions/musicFunctions');
function pause(command, language) {
    const serverQueue = checkStats(command, language, true);

    if (serverQueue) {
        serverQueue.player.pause(true);
        serverQueue.playing = false;
        return commandReply.reply(command, language.pause, 'BLUE');
    }
}
module.exports = {
    name: 'pause',
    guildOnly: true,
    description: true,
    async execute(message, _args, language) {
        await pause(message, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder(),
        async execute(interaction, language) {
            await pause(interaction, language);
        },
    },
};
