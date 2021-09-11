const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const commandReply = new CommandReply();
function skip(command, language) {
    const { queue } = require('../../data/queueData');
    const serverQueue = queue.get(command.guild.id);

    if (!command.member.voice.channel) {
        return commandReply.reply(command, language.notInVC, 'RED');
    }
    if (!serverQueue) {
        return commandReply.reply(command, language.cantSkip, 'RED');
    }
    serverQueue.player.end();
}
module.exports = {
    name: 'skip',
    guildOnly: true,
    aliases: ['next'],
    description: true,
    execute(message, _args, language) {
        skip(message, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder(),
        async execute(interaction, language) {
            skip(interaction, language);
        },
    },
};
