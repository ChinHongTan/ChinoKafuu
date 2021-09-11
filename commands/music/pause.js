const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const commandReply = new CommandReply();
function pause(command, language) {
    const { queue } = require('../../data/queueData');
    const serverQueue = queue.get(command.guild.id);

    if (!command.member.voice.channel) {
        return commandReply.reply(command, language.notInVC, 'RED');
    }

    if (serverQueue) {
        if (!serverQueue.playing) return commandReply.reply(command, 'I am not playing!', 'RED');
        serverQueue.player.pause(true);
        serverQueue.playing = false;
        return commandReply.reply(command, 'Paused!', 'BLUE');
    }
    return commandReply.reply(command, language.noSong, 'RED');
}
module.exports = {
    name: 'pause',
    guildOnly: true,
    description: true,
    execute(message, _args, language) {
        pause(message, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder(),
        async execute(interaction, language) {
            pause(interaction, language);
        },
    },
};
