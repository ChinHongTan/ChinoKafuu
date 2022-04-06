const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const commandReply = new CommandReply();
const { checkStats } = require('../../functions/musicFunctions');
function resume(command, language) {
    const serverQueue = checkStats(command, language);

    if (serverQueue) {
        if (serverQueue.playing) return commandReply.reply(command, 'I am already playing!', 'RED');
        serverQueue.player.unpause();
        serverQueue.playing = true;
        return commandReply.reply(command, 'Resumed!', 'GREEN');
    }
}
module.exports = {
    name: 'resume',
    guildOnly: true,
    description: true,
    execute(message, _args, language) {
        resume(message, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder(),
        execute(interaction, language) {
            resume(interaction, language);
        },
    },
};
