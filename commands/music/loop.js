const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const commandReply = new CommandReply();
module.exports = {
    name: 'loop',
    guildOnly: true,
    description: 'Loop the currently played song!',
    execute(message, _args, language) {
        const queueData = require('../../data/queueData');
        const { queue } = queueData;
        const serverQueue = queue.get(message.guild.id);

        if (!message.member.voice.channel) {
            return commandReply.reply(message, language.notInVC, 'RED');
        }

        if (serverQueue) {
            serverQueue.loop = !serverQueue.loop;
            if (serverQueue.loopQueue) serverQueue.loopQueue = false;
            return commandReply.reply(message, serverQueue.loop ? 'Loop mode on!' : 'Loop mode off!', 'GREEN');
        }
        return commandReply.reply(message, language.noSong, 'RED');
    },
    slashCommand: {
        data: new SlashCommandBuilder()
            .setName('loop')
            .setDescription('Loop the currently played song!'),
        async execute(interaction, language) {
            const queueData = require('../../data/queueData');
            const { queue } = queueData;
            const serverQueue = queue.get(interaction.guild.id);

            if (!interaction.member.voice.channel) {
                return commandReply.reply(interaction, language.notInVC, 'RED');
            }

            if (serverQueue) {
                serverQueue.loop = !serverQueue.loop;
                if (serverQueue.loopQueue) serverQueue.loopQueue = false;
                return commandReply.reply(interaction, serverQueue.loopQueue ? 'Loop mode on!' : 'Loop mode off!', 'GREEN');
            }
            return commandReply.reply(interaction, language.noSong, 'RED');
        },
    },
};
