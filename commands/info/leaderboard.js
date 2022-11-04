const { reply } = require('../../functions/Util');
const { MessageEmbed, Util } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

function getLeaderboard(command, guild) {
    const userList = command.client.guildCollection.get(guild.id).data.users;
    let leaderboard = '';
    userList.forEach((user, index) => {
        leaderboard += `${index + 1}. ${user.name}\n level: ${user.level} exp: ${user.exp}\n\n`;
    });
    return new MessageEmbed()
        .setTitle('Leaderboard')
        .setThumbnail(guild.iconURL({ format: 'png', dynamic: true }))
        .setColor('BLURPLE')
        .setDescription(Util.escapeMarkdown(leaderboard));
}

module.exports = {
    name: 'leaderboard',
    coolDown: 3,
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescriptionLocalizations({
            'en-US': 'Get server\'s leaderboard',
            'zh-CN': '显示伺服器排行榜',
            'zh-TW': '顯示伺服器排行榜',
        }),

    async execute(interaction) {
        return reply(interaction, { embeds: [getLeaderboard(interaction, interaction.guild)] });
    },
};