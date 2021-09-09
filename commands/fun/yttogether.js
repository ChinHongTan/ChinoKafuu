const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const commandReply = new CommandReply();
const { DiscordTogether } = require('discord-together');
async function yttogether(command, language) {
    const { client } = command;
    client.discordTogether = new DiscordTogether(client);
    if (command.member.voice.channel) {
        const invite = await client.discordTogether.createTogetherCode(command.member.voice.channelID, 'youtube');
        return commandReply.reply(command, invite.code, 'BLUE');
    }
    commandReply.reply(command, language.notInVC, 'RED');
}
module.exports = {
    name: 'yttogether',
    cooldown: 3,
    aliases: ['yt', 'youtube'],
    description: true,
    async execute(message, _args, language) {
        yttogether(message, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder(),
        async execute(interaction, language) {
            yttogether(interaction, language);
        },
    },
};
