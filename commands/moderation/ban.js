const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const commandReply = new CommandReply();
const Discord = require('discord.js');
async function ban(command, args = []) {
    const taggedUser = command instanceof Discord.CommandInteraction ? args[0] : command.mentions.members.first();
    if (!taggedUser) return commandReply.reply(command, ':x: | You need to tag a user in order to ban them!', 'RED');
    if (taggedUser.id === command.author.id) return command.channel.send('You Cannot Ban Yourself!');
    if (!taggedUser.bannable) return command.channel.send('Cannot Ban This User!');
    await command.guild.members.ban(taggedUser);
    command.channel.send(`Successfully Banned: ${taggedUser.user.username}!`);
}
module.exports = {
    name: 'ban',
    description: 'Ban someone.',
    guildOnly: true,
    usage: '[mention]',
    permissions: 'ADMINISTRATOR',
    async execute(message) {
        await ban(message);
    },
    slashCommand: {
        data: new SlashCommandBuilder()
            .addUserOption((option) =>
                option.setName('member')
                    .setDescription('member to ban')
                    .setRequired(true)),
        async execute(interaction, language) {
            await ban(interaction, [interaction.options.getUser('member')], language);
        },
    },
};
