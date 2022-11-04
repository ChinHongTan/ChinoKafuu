const { success, error } = require('../../functions/Util.js');
const { checkStats } = require('../../functions/musicFunctions');
const { SlashCommandBuilder } = require('@discordjs/builders');
async function remove(command, args, language) {
    const serverQueue = await checkStats(command);
    if (serverQueue === 'error') return;

    if (serverQueue) {
        args.forEach((number) => {
            const queuenum = Number(number);
            if (Number.isInteger(queuenum) && queuenum <= serverQueue.songs.length && queuenum > 0) {
                serverQueue.songs.splice(queuenum, 1);
                return success(command, language.removed.replace('${serverQueue.songs[queuenum].title}', serverQueue.songs[queuenum].title));
            } else {
                return error(command, language.invalidInt);
            }
        });
    }
}
module.exports = {
    name: 'remove',
    guildOnly: true,
    aliases: ['r'],
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescriptionLocalizations({
            'en-US': 'Removes a song from the song queue',
            'zh-CN': '从清单中移除歌曲',
            'zh-TW': '從清單中移除歌曲',
        })
        .addIntegerOption((option) => option
            .setName('index')
            .setDescriptionLocalizations({
                'en-US': 'Index of song to remove',
                'zh-CN': '要移除的歌曲的序号',
                'zh-TW': '要移除的歌曲的序號',
            }),
        ),
    execute(interaction, language) {
        return remove(interaction, [interaction.options.getInteger('index')], language);
    },
};
