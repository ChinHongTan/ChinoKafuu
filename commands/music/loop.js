const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const commandReply = new CommandReply();
function loop(command, language) {
    const queueData = require('../../data/queueData');
    const { queue } = queueData;
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
    description: 'Loop the currently played song!',
    execute(message, _args, language) {
        loop(message, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder()
            .setName('loop')
            .setDescription('Loop the currently played song!'),
        async execute(interaction, language) {
            loop(interaction, language);
        },
    },
};
