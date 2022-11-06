const { success } = require('../../functions/Util.js');
const { checkStats } = require('../../functions/musicFunctions');
const { SlashCommandBuilder } = require('@discordjs/builders');
async function skip(command, language) {
    const serverQueue = await checkStats(command);
    if (serverQueue === 'error') return;

    serverQueue.player.stop();
    return success(command, language.skipped);
}
module.exports = {
    name: 'skip',
    guildOnly: true,
    aliases: ['next'],
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('跳過歌曲')
        .setDescriptionLocalizations({
            'en-US': 'Skips a song.',
            'zh-CN': '跳过歌曲',
            'zh-TW': '跳過歌曲',
        }),
    execute(interaction, language) {
        return skip(interaction, language);
    },
};
