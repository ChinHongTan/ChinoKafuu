const { error, success } = require('../../functions/Util.js');
const { checkStats } = require('../../functions/musicFunctions');
async function resume(command, language, languageStr) {
    const serverQueue = await checkStats(command, languageStr);
    if (serverQueue === 'error') return;

    if (serverQueue) {
        if (serverQueue.playing) return error(command, language.playing);
        serverQueue.player.unpause();
        serverQueue.playing = true;
        return success(command, language.resume);
    }
}
module.exports = {
    name: 'resume',
    guildOnly: true,
    description: {
        'en_US': 'Resume the song!',
        'zh_CN': '继续播放歌曲！',
        'zh_TW': '繼續播放歌曲！',
    },
    execute(message, _args, language, languageStr) {
        return resume(message, language, languageStr);
    },
    slashCommand: {
        execute(interaction, language, languageStr) {
            return resume(interaction, language, languageStr);
        },
    },
};
