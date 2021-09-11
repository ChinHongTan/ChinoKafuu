const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const { queue } = require('../../data/queueData');
const commandReply = new CommandReply();
function clear(command, language) {
    const serverQueue = queue.get(command.guild.id);

    if (!command.member.voice.channel) {
        return commandReply.reply(command, language.notInVC, 'RED');
    }

    if (!serverQueue) return commandReply.reply(command, language.noSong, 'RED');

    serverQueue.songs = [];
}
module.exports = {
    name: 'clear',
    guildOnly: true,
    description: true,
    async execute(message, _args, language) {
        await clear(message, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder(),
        async execute(interaction, language) {
            await clear(interaction, language);
        },
    },
};