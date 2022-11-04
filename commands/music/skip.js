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
        .setDescriptionLocalizations({
            'en_US': 'Skips a song.',
            'zh_CN': '跳过歌曲',
            'zh_TW': '跳過歌曲',
        }),
    execute(interaction, language) {
        return skip(interaction, language);
    },
};
