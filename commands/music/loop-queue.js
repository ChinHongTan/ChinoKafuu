const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const commandReply = new CommandReply();
function loopQueue(command, language) {
    const { queue } = require('../../data/queueData');
    const serverQueue = queue.get(command.guild.id);

    if (!command.member.voice.channel) {
        return commandReply.reply(command, language.notInVC, 'RED');
    }

    if (serverQueue) {
        serverQueue.loopQueue = !serverQueue.loopQueue;
        if (serverQueue.loop) serverQueue.loop = false;
        return commandReply.reply(command, serverQueue.loopQueue ? 'Loop queue on!' : 'Loop queue off!', 'GREEN');
    }
    return commandReply.reply(command, language.noSong, 'RED');
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
