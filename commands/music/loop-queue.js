const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const commandReply = new CommandReply();
module.exports = {
    name: 'loop-queue',
    guildOnly: true,
    aliases: ['lq', 'loopqueue'],
    description: 'Loop the currently played queue!',
    execute(message, _args, language) {
        const queueData = require('../../data/queueData');
        const { queue } = queueData;
        const serverQueue = queue.get(message.guild.id);

        if (!message.member.voice.channel) {
            return commandReply.reply(message, language.notInVC, 'RED');
        }

        if (serverQueue) {
            serverQueue.loopQueue = !serverQueue.loopQueue;
            if (serverQueue.loop) serverQueue.loop = false;
            return commandReply.reply(message, serverQueue.loopQueue ? 'Loop queue on!' : 'Loop queue off!', 'GREEN');
        }
        return commandReply.reply(message, language.noSong, 'RED');
    },
    slashCommand: {
        data: new SlashCommandBuilder()
            .setName('loop-queue')
            .setDescription('Loop the currently played queue!'),
        async execute(interaction, language) {
            const queueData = require('../../data/queueData');
            const { queue } = queueData;
            const serverQueue = queue.get(interaction.guild.id);

            if (!interaction.member.voice.channel) {
                return commandReply.reply(interaction, language.notInVC, 'RED');
            }

            if (serverQueue) {
                serverQueue.loopQueue = !serverQueue.loopQueue;
                if (serverQueue.loop) serverQueue.loop = false;
                return commandReply.reply(interaction, serverQueue.loopQueue ? 'Loop queue on!' : 'Loop queue off!', 'GREEN');
            }
            return commandReply.reply(interaction, language.noSong, 'RED');
        },
    },
};
