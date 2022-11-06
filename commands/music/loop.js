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
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('循環播放當前歌曲！')
        .setDescriptionLocalizations({
            'en-US': 'Loop the currently played song!',
            'zh-CN': '循环播放当前歌曲！',
            'zh-TW': '循環播放當前歌曲！',
        }),
    async execute(interaction, language) {
        return loop(interaction, language);
    },
};
