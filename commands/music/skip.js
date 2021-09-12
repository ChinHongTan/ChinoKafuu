const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const commandReply = new CommandReply();
async function skip(command, language) {
    const { queue } = require('../../data/queueData');
    const serverQueue = queue.get(command.guild.id);

    if (!command.member.voice.channel) {
        return commandReply.reply(command, language.notInVC, 'RED');
    }
    if (!serverQueue) {
        return commandReply.reply(command, language.cantSkip, 'RED');
    }
    serverQueue.player.stop();
}
module.exports = {
    name: 'skip',
    guildOnly: true,
    aliases: ['next'],
    description: true,
    async execute(message, _args, language) {
        await skip(message, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder(),
        async execute(interaction, language) {
            await skip(interaction, language);
        },
    },
};
