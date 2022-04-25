const { error } = require('../../functions/Util.js');
const { checkStats } = require('../../functions/musicFunctions');
async function clear(command, language, languageStr) {
    const serverQueue = await checkStats(command, languageStr);
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
    execute(message, _args, language, languageStr) {
        return clear(message, language, languageStr);
    },
    slashCommand: {
        execute(interaction, language, languageStr) {
            return clear(interaction, language, languageStr);
        },
    },
};