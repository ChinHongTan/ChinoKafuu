const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const commandReply = new CommandReply();
function stop(command, language) {
    const { queue } = require('../../data/queueData');
    const serverQueue = queue.get(command.guild.id);

    if (!command.member.voice.channel) {
        return commandReply.reply(command, language.notInVC, 'RED');
    }

    if (!serverQueue) return commandReply.reply(command, language.noSong, 'RED');

    serverQueue.songs = [];
    serverQueue.player.stop();
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
