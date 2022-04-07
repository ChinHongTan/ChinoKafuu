const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const commandReply = new CommandReply();
const { checkStats } = require('../../functions/musicFunctions');
function loop(command, language) {
    const serverQueue = checkStats(command, language);
    if (serverQueue === 'error') return;

    if (serverQueue) {
        serverQueue.loop = !serverQueue.loop;
        if (serverQueue.loopQueue) serverQueue.loopQueue = false;
        return commandReply.reply(command, serverQueue.loop ? 'Loop mode on!' : 'Loop mode off!', 'GREEN');
    }
}
module.exports = {
    name: 'loop',
    guildOnly: true,
    description: true,
    execute(message, _args, language) {
        loop(message, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder(),
        async execute(interaction, language) {
            loop(interaction, language);
        },
    },
};
