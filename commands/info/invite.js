const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const commandReply = new CommandReply();

async function sendLink(command) {
    return commandReply.reply(command, 'Here you go!\nhttps://discord.com/api/oauth2/authorize?client_id=958201832528838706&permissions=8&scope=bot%20applications.commands', 'BLUE');
}
module.exports = {
    name: 'invite',
    aliases: ['inv'],
    description: true,
    async execute(message) {
        await sendLink(message);
    },
    slashCommand: {
        data: new SlashCommandBuilder(),
        async execute(interaction) {
            await sendLink(interaction);
        },
    },
};