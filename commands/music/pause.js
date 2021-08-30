const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const commandReply = new CommandReply();
function pause(command, language) {
    const queueData = require('../../data/queueData');
    const { queue } = queueData;
    const serverQueue = queue.get(command.guild.id);

    if (!command.member.voice.channel) {
        return commandReply.reply(command, language.notInVC, 'RED');
    }

    if (serverQueue) {
        if (!serverQueue.playing) return commandReply.reply(command, 'I am not playing!', 'RED');
        serverQueue.connection.dispatcher.pause(true);
        serverQueue.playing = false;
        return commandReply.reply(command, 'Paused!', 'BLUE');
    }
    return commandReply.reply(command, language.noSong, 'RED');
}
module.exports = {
    name: 'pause',
    guildOnly: true,
    description: 'Pause!',
    execute(message, _args, language) {
        pause(message, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder()
            .setName('pause')
            .setDescription('Pause!'),
        async execute(interaction, language) {
            pause(interaction, language);
        },
    },
};
