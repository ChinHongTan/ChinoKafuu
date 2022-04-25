const { success } = require('../../functions/Util.js');
const { checkStats } = require('../../functions/musicFunctions');
async function loop(command, language, languageStr) {
    const serverQueue = await checkStats(command, languageStr);
    if (serverQueue === 'error') return;

    if (serverQueue) {
        serverQueue.loop = !serverQueue.loop;
        if (serverQueue.loopQueue) serverQueue.loopQueue = false;
        return success(command, serverQueue.loop ? language.on : language.off);
    }
}
module.exports = {
    name: 'loop',
    guildOnly: true,
    description: {
        'en_US': 'Loop the currently played song!',
        'zh_CN': '循环播放当前歌曲！',
        'zh_TW': '循環播放當前歌曲！',
    },
    execute(message, _args, language, languageStr) {
        return loop(message, language, languageStr);
    },
    slashCommand: {
        async execute(interaction, language, languageStr) {
            return loop(interaction, language, languageStr);
        },
    },
};
