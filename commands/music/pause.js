const { success } = require('../../functions/Util.js');
const { checkStats } = require('../../functions/musicFunctions');
async function pause(command, language, languageStr) {
    const serverQueue = await checkStats(command, languageStr, true);
    if (serverQueue === 'error') return;

    if (serverQueue) {
        serverQueue.player.pause(true);
        serverQueue.playing = false;
        return success(command, language.pause);
    }
}
module.exports = {
    name: 'pause',
    guildOnly: true,
    description: {
        'en_US': 'Pause the song!',
        'zh_CN': '暂停播放歌曲！',
        'zh_TW': '暫停播放歌曲！',
    },
    execute(message, _args, language, languageStr) {
        return pause(message, language, languageStr);
    },
    slashCommand: {
        execute(interaction, language, languageStr) {
            return pause(interaction, language, languageStr);
        },
    },
};
