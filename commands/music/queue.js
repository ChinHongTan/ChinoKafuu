const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const commandReply = new CommandReply();
const { format, checkStats } = require('../../functions/musicFunctions');
const { MessageEmbed } = require('discord.js');
const DynamicEmbed = require('../../functions/dynamicEmbed');
const dynamicEmbed = new DynamicEmbed();
async function queueFunc(command, language) {
    const serverQueue = checkStats(command, language);
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

    if (serverQueue) {
        const songQueue = serverQueue.songs.slice(1);
        songQueue.forEach((item, index) => {
            item.index = index + 1;
        });
        const arrayChunk = array_chunks(songQueue, 10);
        if (songQueue.length > 10) {
            await dynamicEmbed.createEmbedFlip(command, arrayChunk, ['⬅️', '➡️'], createEmbed);
        }
        else {
            const embed = createEmbed(songQueue);
            return commandReply.reply(command, embed);
        }
    }
}
module.exports = {
    name: 'queue',
    guildOnly: true,
    aliases: ['q'],
    description: true,
    async execute(message, _args, language) {
        await queueFunc(message, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder(),
        async execute(interaction, language) {
            await queueFunc(interaction, language);
        },
    },
};
