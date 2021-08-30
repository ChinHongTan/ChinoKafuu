const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const commandReply = new CommandReply();
function skip(command, language) {
    const queueData = require('../../data/queueData');
    const { queue } = queueData;
    const serverQueue = queue.get(command.guild.id);

    if (!command.member.voice.channel) {
        return commandReply.reply(command, language.notInVC, 'RED');
    }
    if (!serverQueue) {
        return commandReply.reply(command, language.cantSkip, 'RED');
    }
    serverQueue.connection.dispatcher.end();
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
        data: new SlashCommandBuilder()
            .setName('skip')
            .setDescription('Skips a song'),
        async execute(interaction, language) {
            skip(interaction, language);
        },
    },
};
