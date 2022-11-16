import { reply, getUserData } from '../../functions/Util';
import { GuildMember, MessageEmbed } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CustomCommandInteraction } from '../../../typings';

async function level(command: CustomCommandInteraction, member: GuildMember) {
    const userList = command.client.guildCollection.get(member.guild.id).data.users;
    let userData = userList.find((user) => user.id === member.id);
    if (!userData) userData = await getUserData(command.client, member);
    const userExp = userData.exp;
    const userLevel = userData.level;
    const expNeeded = userLevel * ((1 + userLevel) / 2) + 4;
    return new MessageEmbed()
        .setAuthor({
            name: member.displayName,
            iconURL: member.user.displayAvatarURL({ format: 'png', dynamic: true }),
        })
        .setColor('BLURPLE')
        .addField('Rank', '' + (userList.findIndex((user) => user.id === member.id) + 1) + '/' + '' + member.guild.memberCount)
        .addField('Level', '' + userLevel, true)
        .addField('Exp', '' + userExp + '/' + '' + expNeeded, true);
}

module.exports = {
    name: 'level',
    coolDown: 3,
    data: new SlashCommandBuilder()
        .setName('level')
        .setDescription('顯示成員的等級')
        .setDescriptionLocalizations({
            'en-US': 'Get a member\'s level',
            'zh-CN': '显示成员的等级',
            'zh-TW': '顯示成員的等級',
        })
        .addUserOption((option) => option
            .setName('member')
            .setDescription('選擇群員，如果没有指明群员，我将会发送你的等級')
            .setDescriptionLocalizations({
                'en-US': 'member\'s level, will send your level if no arguments given',
                'zh-CN': '选择群员，如果没有指明群员，我将会发送你的等级',
                'zh-TW': '選擇群員，如果没有指明群员，我将会发送你的等級',
            }),
        ),
    async execute(interaction: CustomCommandInteraction) {
        const user = interaction.options.getMember('member') || interaction.member;
        if (!(user instanceof GuildMember)) return;
        if (!user) {
            return reply(interaction, { embeds: [await level(interaction, user)] });
        }
        return reply(interaction, { embeds: [await level(interaction, user)] });
    },
};