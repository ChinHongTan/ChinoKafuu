const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const commandReply = new CommandReply();
const { format } = require('../../functions/musicFunctions');
const { MessageEmbed } = require('discord.js');
const DynamicEmbed = require('../../functions/dynamicEmbed');
const dynamicEmbed = new DynamicEmbed();
function queueFunc(command, language) {
    const queueData = require('../../data/queueData');
    const { queue } = queueData;
    const serverQueue = queue.get(command.guild.id);
    const array_chunks = (array, chunkSize) => Array(Math.ceil(array.length / chunkSize)).fill().map((_, index) => index * chunkSize).map((begin) => array.slice(begin, begin + chunkSize));

    /**
     * Create an Discord embed message
     * @param {object} smallChunk - Song queue split by 10 songs
     * @return {object} Discord embed
     */
    function createEmbed(smallChunk) {
        const arr = smallChunk.map((item) => `${item.index}.[${item.title}](${item.url}) | ${format(item.duration)}`);
        const printQueue = arr.join('\n\n');
        return new MessageEmbed()
            .setColor('#ff0000')
            .setTitle(language.queueTitle)
            .setDescription(language.queueBody.replace('${serverQueue.songs[0].title}', serverQueue.songs[0].title).replace('${serverQueue.songs[0].url}', serverQueue.songs[0].url).replace('${printQueue}', printQueue).replace('${serverQueue.songs.length - 1}', serverQueue.songs.length - 1));
    }

    if (!command.member.voice.channel) {
        return commandReply.reply(command, language.notInVC, 'RED');
    }

    if (serverQueue) {
        const songQueue = serverQueue.songs.slice(1);
        songQueue.forEach((item, index) => {
            item.index = index + 1;
        });
        const arrayChunk = array_chunks(songQueue, 10);
        if (songQueue.length > 10) {
            dynamicEmbed.createEmbedFlip(command, arrayChunk, ['⬅️', '➡️'], createEmbed);
        }
        else {
            const embed = createEmbed(songQueue);
            return commandReply.reply(command, embed);
        }
    }
    else {
        return commandReply.reply(command, language.noSong, 'RED');
    }
}
module.exports = {
    name: 'queue',
    guildOnly: true,
    aliases: ['q'],
    description: true,
    execute(message, _args, language) {
        queueFunc(message, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder(),
        async execute(interaction, language) {
            await queueFunc(interaction, language);
        },
    },
};
