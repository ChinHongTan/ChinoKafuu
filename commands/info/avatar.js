const { reply } = require('../../functions/Util.js');
const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'avatar',
    coolDown: 10,
    aliases: ['icon', 'pfp', 'av'],
    guildOnly: true,
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('發送用戶頭像')
        .setDescriptionLocalizations({
            'en-US': 'Send user avatar.',
            'zh-CN': '发送用户头像',
            'zh-TW': '發送用戶頭像',
        })
        .addUserOption((option) => option
            .setName('member')
            .setDescription('群員的頭像，如果没有指明群员，我将会发送你的头像')
            .setDescriptionLocalizations({
                'en-US': 'member\'s avatar, will send your avatar if no arguments given',
                'zh-CN': '群员的头像，如果没有指明群员，我将会发送你的头像',
                'zh-TW': '群員的頭像，如果没有指明群员，我将会发送你的头像',
            }),
        ),

    async execute(interaction, language) {
        const user = interaction.options.getMember('member') ?? interaction.member;
        const embed = new MessageEmbed()
            .setTitle(language.memberAvatar.replace('${user.displayName}', user.displayName))
            .setColor(user.displayHexColor)
            .setImage(user.user.displayAvatarURL({
                format: 'png',
                dynamic: true,
                size: 2048,
            }));
        return reply(interaction, { embeds: [embed] });
    },
};
