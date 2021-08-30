const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const commandReply = new CommandReply();
function stop(command, language) {
    const queueData = require('../../data/queueData');
    const { queue } = queueData;
    const serverQueue = queue.get(command.guild.id);

    if (!command.member.voice.channel) {
        return commandReply.reply(command, language.notInVC, 'RED');
    }

    if (!serverQueue) return commandReply.reply(command, language.noSong, 'RED');

    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
}
module.exports = {
    name: 'stop',
    guildOnly: true,
    description: true,
    execute(message, _args, language) {
        stop(message, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder(),
        async execute(interaction, language) {
            stop(interaction, language);
        },
    },
};
