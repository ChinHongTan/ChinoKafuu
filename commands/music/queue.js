const { reply } = require('../../functions/Util.js');
const { format, checkStats } = require('../../functions/musicFunctions');
const { MessageEmbed } = require('discord.js');
const Paginator = require('../../functions/paginator');
const { SlashCommandBuilder } = require('@discordjs/builders');

function arrayChunks(array, chunkSize) {
    const resultArray = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        const chunk = array.slice(i, i + chunkSize);
        resultArray.push(chunk);
    }
    return resultArray;
}

async function queueFunc(command, language) {
    const serverQueue = await checkStats(command);
    if (serverQueue === 'error') return;

    /**
     * Create a Discord embed message
     * @param {object} smallChunk - Song queue split by 10 songs
     * @return {object} Discord embed
     */
    function createEmbed(smallChunk) {
        const arr = smallChunk.map((item) => `${item.index}.[${item.title}](${item.url}) | ${format(item.duration)}`);
        const printQueue = arr.join('\n\n');
        return new MessageEmbed()
            .setColor('#ff0000')
            .setTitle(language.queueTitle)
            .setDescription(
                language.queueBody
                    .replace('${serverQueue.songs[0].title}', serverQueue.songs[0].title)
                    .replace('${serverQueue.songs[0].url}', serverQueue.songs[0].url)
                    .replace('${printQueue}', printQueue)
                    .replace('${serverQueue.songs.length - 1}', `${serverQueue.songs.length - 1}`));
    }

    if (serverQueue) {
        const songQueue = serverQueue.songs.slice(1);
        songQueue.forEach((item, index) => {
            item.index = index + 1;
        });
        const arrayChunk = arrayChunks(songQueue, 10);
        if (songQueue.length > 10) {
            const paginator = new Paginator(arrayChunk, command);
            const message = paginator.render();
            const collector = message.createMessageComponentCollector({
                filter: ({ customId, user }) =>
                    ['button1', 'button2', 'button3', 'button4'].includes(customId) && user.id === command.member.id,
                idle: 60000,
            });
            collector.on('collect', async (button) => {
                await paginator.paginate(button, 0);
            });
            collector.on('end', async (button) => {
                if (!button.first()) {
                    message.channel.send(language.timeout);
                    await message.delete();
                }
            });
        } else {
            const embed = createEmbed(songQueue);
            return reply(command, { embeds: [embed] });
        }
    }
}
module.exports = {
    name: 'queue',
    guildOnly: true,
    aliases: ['q'],
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('查詢目前的播放清單')
        .setDescriptionLocalizations({
            'en-US': 'Get the current song queue.',
            'zh-CN': '查询目前的播放清单',
            'zh-TW': '查詢目前的播放清單',
        }),
    async execute(interaction, language) {
        await queueFunc(interaction, language);
    },
};
