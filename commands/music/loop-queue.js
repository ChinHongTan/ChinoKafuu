const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const commandReply = new CommandReply();
const { checkStats } = require('../../functions/musicFunctions');
function loopQueue(command, language) {
    const serverQueue = checkStats(command, language);

    if (serverQueue) {
        serverQueue.loopQueue = !serverQueue.loopQueue;
        if (serverQueue.loop) serverQueue.loop = false;
        return commandReply.reply(command, serverQueue.loopQueue ? 'Loop queue on!' : 'Loop queue off!', 'GREEN');
    }
}
module.exports = {
    name: 'loop-queue',
    guildOnly: true,
    aliases: ['lq', 'loopqueue'],
    description: true,
    execute(message, _args, language) {
        loopQueue(message, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder(),
        async execute(interaction, language) {
            loopQueue(interaction, language);
        },
    },
};
