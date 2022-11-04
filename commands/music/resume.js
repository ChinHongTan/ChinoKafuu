const { error, success } = require('../../functions/Util.js');
const { checkStats } = require('../../functions/musicFunctions');
const { SlashCommandBuilder } = require('@discordjs/builders');
async function resume(command, language) {
    const serverQueue = await checkStats(command);
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
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescriptionLocalizations({
            'en-US': 'Resume the song!',
            'zh-CN': '继续播放歌曲！',
            'zh-TW': '繼續播放歌曲！',
        }),
    execute(interaction, language) {
        return resume(interaction, language);
    },
};
