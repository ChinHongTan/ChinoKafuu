const { SlashCommandBuilder } = require('@discordjs/builders');
const { reply } = require('../../functions/commandReply.js');
const { DiscordTogether } = require('discord-together');
async function ytTogether(command, language) {
    const { client } = command;
    client.discordTogether = new DiscordTogether(client);
    if (command.member.voice.channel) {
        const invite = await client.discordTogether.createTogetherCode(command.member.voice.channel.id, 'youtube');
        return reply(command, invite.code, 'BLUE');
    }
    await reply(command, language.notInVC, 'RED');
}
module.exports = {
    name: 'yt-together',
    cooldown: 3,
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
        data: new SlashCommandBuilder(),
        async execute(interaction, language) {
            await ytTogether(interaction, language);
        },
    },
};
