const { SlashCommandBuilder } = require('@discordjs/builders');
const { reply } = require('../../functions/commandReply.js');

async function kick(command, taggedUser) {
    if (!taggedUser) return reply(command, ':warning: | You need to tag a user in order to kick them!', 'YELLOW');
    if (taggedUser.id === command.author.id) return reply(command, ':x: | You Cannot Kick Yourself!', 'RED');
    if (!taggedUser.kickable) return command.channel.send('Cannot Kick This User!');
    await taggedUser.kick();
    return reply(command, `Successfully Kicked: ${taggedUser.user.username}!`, 'GREEN');
}

module.exports = {
    name: 'kick',
    description: 'Kick someone out.',
    guildOnly: true,
    usage: '[mention]',
    permissions: 'ADMINISTRATOR',
    async execute(message) {
        await kick(message, message.mentions.members.first());
    },
    slashCommand: {
        data: new SlashCommandBuilder()
            .addUserOption((option) =>
                option.setName('member')
                    .setDescription('Member to kick')
                    .setRequired(true)),
        async execute(interaction, language) {
            await kick(interaction, interaction.options.getUser('member'), language);
        },
    },
};
