const { SlashCommandBuilder } = require('@discordjs/builders');
const { reply } = require('../../functions/commandReply.js');
const { checkStats } = require('../../functions/musicFunctions');
async function loop(command, language) {
    const serverQueue = await checkStats(command, language);
    if (serverQueue === 'error') return;

    if (serverQueue) {
        serverQueue.loop = !serverQueue.loop;
        if (serverQueue.loopQueue) serverQueue.loopQueue = false;
        return reply(command, serverQueue.loop ? language.on : language.off, 'GREEN');
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
    execute(message, _args, language) {
        return loop(message, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder(),
        async execute(interaction, language) {
            return loop(interaction, language);
        },
    },
};
