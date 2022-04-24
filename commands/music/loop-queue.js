const { success } = require('../../functions/Util.js');
const { checkStats } = require('../../functions/musicFunctions');
async function loopQueue(command, language) {
    const serverQueue = await checkStats(command, language);
    if (serverQueue === 'error') return;

    if (serverQueue) {
        serverQueue.loopQueue = !serverQueue.loopQueue;
        if (serverQueue.loop) serverQueue.loop = false;
        return success(command, serverQueue.loopQueue ? language.on : language.off);
    }
}
module.exports = {
    name: 'loop-queue',
    guildOnly: true,
    aliases: ['lq', 'loopqueue'],
    description: {
        'en_US': 'Loop the currently played queue!',
        'zh_CN': '循环播放歌曲清单',
        'zh_TW': '循環播放歌曲清單',
    },
    execute(message, _args, language) {
        return loopQueue(message, language);
    },
    slashCommand: {
        execute(interaction, language) {
            return loopQueue(interaction, language);
        },
    },
};
