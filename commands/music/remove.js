const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const commandReply = new CommandReply();
async function remove(command, args, language) {
    const { queue } = require('../../data/queueData');
    const serverQueue = queue.get(command.guild.id);
    if (!command.member.voice.channel) {
        return commandReply.reply(command, language.notInVC, 'RED');
    }

    if (serverQueue) {
        args.forEach((number) => {
            const queuenum = Number(number);
            if (Number.isInteger(queuenum) && queuenum <= serverQueue.songs.length && queuenum > 0) {
                commandReply.reply(command, language.removed.replace('${serverQueue.songs[queuenum].title}', serverQueue.songs[queuenum].title), 'GREEN');
                serverQueue.songs.splice(queuenum, 1);
            }
            else {
                commandReply.reply(command, language.invalidInt, 'RED');
            }
        });
    }
    else {
        return commandReply.reply(command, language.noSong, 'RED');
    }
}
module.exports = {
    name: 'remove',
    guildOnly: true,
    aliases: ['r'],
    description: true,
    async execute(message, args, language) {
        await remove(message, args, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder()
            .addIntegerOption((option) => option.setName('index').setDescription('song to remove').setRequired(true)),
        async execute(interaction, language) {
            await remove(interaction, interaction.options.getInteger('index'), language);
        },
    },
};
