const { error } = require('../../functions/Util.js');
const { checkStats } = require('../../functions/musicFunctions');
const { SlashCommandBuilder } = require('@discordjs/builders');
async function clear(command, language) {
    const serverQueue = await checkStats(command);
    if (serverQueue === 'error') return;

    serverQueue.songs.splice(1);
    return error(command, language.cleared);
}
module.exports = {
    name: 'clear',
    guildOnly: true,
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('清除播放佇列')
        .setDescriptionLocalizations({
            'en-US': 'Clear the song queue',
            'zh-CN': '清除播放行列',
            'zh-TW': '清除播放佇列',
        }),
    execute(interaction, language) {
        return clear(interaction, language);
    },
};