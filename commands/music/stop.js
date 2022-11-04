const { success } = require('../../functions/Util.js');
const { checkStats } = require('../../functions/musicFunctions');
const { SlashCommandBuilder } = require('@discordjs/builders');
async function stop(command, language) {
    const serverQueue = await checkStats(command);
    if (serverQueue === 'error') return;

    serverQueue.songs = [];
    serverQueue.player.stop();
    return success(command, language.stopped);
}
module.exports = {
    name: 'stop',
    guildOnly: true,
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescriptionLocalizations({
            'en-US': 'Stops playing songs.',
            'zh-CN': '停止播放歌曲',
            'zh-TW': '停止播放歌曲',
        }),
    async execute(interaction, language) {
        await stop(interaction, language);
    },
};
