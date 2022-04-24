const { success } = require('../../functions/Util.js');
const { checkStats } = require('../../functions/musicFunctions');
async function stop(command, language) {
    const serverQueue = await checkStats(command, language);
    if (serverQueue === 'error') return;

    serverQueue.songs = [];
    serverQueue.player.stop();
    return success(command, language.stopped);
}
module.exports = {
    name: 'stop',
    guildOnly: true,
    description: {
        'en_US': 'Stops playing songs.',
        'zh_CN': '停止播放歌曲',
        'zh_TW': '停止播放歌曲',
    },
    async execute(message, _args, language) {
        await stop(message, language);
    },
    slashCommand: {
        async execute(interaction, language) {
            await stop(interaction, language);
        },
    },
};
