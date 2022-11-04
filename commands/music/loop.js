const { success } = require('../../functions/Util.js');
const { checkStats } = require('../../functions/musicFunctions');
const { SlashCommandBuilder } = require('@discordjs/builders');
async function loop(command, language) {
    const serverQueue = await checkStats(command);
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
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescriptionLocalizations({
            'en_US': 'Loop the currently played song!',
            'zh_CN': '循环播放当前歌曲！',
            'zh_TW': '循環播放當前歌曲！',
        }),
    async execute(interaction, language) {
        return loop(interaction, language);
    },
};
