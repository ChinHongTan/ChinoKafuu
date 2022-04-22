const { SlashCommandBuilder } = require('@discordjs/builders');
const { reply } = require('../../functions/commandReply.js');
const { checkStats } = require('../../functions/musicFunctions');
async function remove(command, args, language) {
    const serverQueue = await checkStats(command, language);
    if (serverQueue === 'error') return;

    if (serverQueue) {
        args.forEach((number) => {
            const queuenum = Number(number);
            if (Number.isInteger(queuenum) && queuenum <= serverQueue.songs.length && queuenum > 0) {
                serverQueue.songs.splice(queuenum, 1);
                return reply(command, language.removed.replace('${serverQueue.songs[queuenum].title}', serverQueue.songs[queuenum].title), 'GREEN');
            } else {
                return reply(command, language.invalidInt, 'RED');
            }
        });
    }
}
module.exports = {
    name: 'remove',
    guildOnly: true,
    aliases: ['r'],
    description: {
        'en_US': 'Removes a song from the song queue',
        'zh_CN': '从清单中移除歌曲',
        'zh_TW': '從清單中移除歌曲',
    },
    options: [
        {
            name: 'index',
            description: {
                'en_US': 'Index of song to remove',
                'zh_CN': '要移除的歌曲的序号',
                'zh_TW': '要移除的歌曲的序號',
            },
            type: 'INTEGER',
            required: true,
        },
    ],
    execute(message, args, language) {
        return remove(message, args, language);
    },
    slashCommand: {
        execute(interaction, language) {
            return remove(interaction, [interaction.options.getInteger('index')], language);
        },
    },
};
