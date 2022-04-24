const { info, error } = require('../../functions/Util.js');
const { DiscordTogether } = require('discord-together');
async function ytTogether(command, language) {
    const { client } = command;
    client.discordTogether = new DiscordTogether(client);
    if (command.member.voice.channel) {
        const invite = await client.discordTogether.createTogetherCode(command.member.voice.channel.id, 'youtube');
        return info(command, invite.code);
    }
    await error(command, language.notInVC);
}
module.exports = {
    name: 'yt-together',
    coolDown: 3,
    aliases: ['yt', 'youtube'],
    description: {
        'en_US': 'Watch YouTube videos together!',
        'zh_CN': '一起看YouTube視頻!',
        'zh_TW': '一起看YouTube視頻!',
    },
    async execute(message, _args, language) {
        await ytTogether(message, language);
    },
    slashCommand: {
        async execute(interaction, language) {
            await ytTogether(interaction, language);
        },
    },
};
