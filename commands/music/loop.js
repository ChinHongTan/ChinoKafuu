const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const commandReply = new CommandReply();
function loop(command, language) {
    const { queue } = require('../../data/queueData');
    const serverQueue = queue.get(command.guild.id);

    if (!command.member.voice.channel) {
        return commandReply.reply(command, language.notInVC, 'RED');
    }

    if (serverQueue) {
        serverQueue.loop = !serverQueue.loop;
        if (serverQueue.loopQueue) serverQueue.loopQueue = false;
        return commandReply.reply(command, serverQueue.loop ? 'Loop mode on!' : 'Loop mode off!', 'GREEN');
    }
    return commandReply.reply(command, language.noSong, 'RED');
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
