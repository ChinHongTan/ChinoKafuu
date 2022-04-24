const { error, success } = require('../../functions/Util.js');
const { checkStats } = require('../../functions/musicFunctions');
async function resume(command, language) {
    const serverQueue = await checkStats(command, language);
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
    execute(message, _args, language) {
        return resume(message, language);
    },
    slashCommand: {
        execute(interaction, language) {
            return resume(interaction, language);
        },
    },
};
