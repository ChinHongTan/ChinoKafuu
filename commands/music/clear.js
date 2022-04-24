const { error } = require('../../functions/Util.js');
const { checkStats } = require('../../functions/musicFunctions');
async function clear(command, language) {
    const serverQueue = await checkStats(command, language);
    if (serverQueue === 'error') return;

    serverQueue.songs.splice(1);
    return error(command, language.cleared);
}
module.exports = {
    name: 'clear',
    guildOnly: true,
    description: {
        'en_US': 'Clear the song queue',
        'zh_CN': '清除播放行列',
        'zh_TW': '清除播放佇列',
    },
    execute(message, _args, language) {
        return clear(message, language);
    },
    slashCommand: {
        execute(interaction, language) {
            return clear(interaction, language);
        },
    },
};