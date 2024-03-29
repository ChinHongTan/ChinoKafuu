const { reply } = require('../../functions/Util.js');
const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

function getUserInfo(author, language) {
    let activityDescription = '';
    if (author?.presence?.activities) {
        for (const activity of author.presence.activities) {
            // custom status
            if (activity.type === 4) {
                activityDescription += language.customStatus
                    .replace('<:${name}:${id}>', activity.emoji)
                    .replace('${state}', activity.state);
            } else {
                activityDescription += language.gameStatus
                    .replace('${type}', activity.type)
                    .replace('${name}', activity.name)
                    .replace('${details}', activity.details ? activity.details : '');
            }
        }
    } else {
        activityDescription = language.notPlaying;
    }
    return new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('User Info')
        .setAuthor({
            name: author.guild.name,
            iconURL: author.guild.iconURL({ dynamic: true }),
            url: 'https://loliconshelter.netlify.app/',
        })
        .setThumbnail(
            author.user.displayAvatarURL({
                format: 'png',
                dynamic: true,
            }),
        )
        .addFields(
            {
                name: language.tag,
                value: author.user.tag,
                inline: true,
            },
            {
                name: language.nickname,
                value: author.displayName,
                inline: true,
            },
            {
                name: language.id,
                value: author.id,
                inline: true,
            },
            {
                name: language.avatarURL,
                value: language.avatarValue
                    .replace('${url}', author.user.displayAvatarURL({ format: 'png', dynamic: true })),
                inline: true,
            },
            {
                name: language.createdAt,
                value: author.user.createdAt.toLocaleDateString('zh-TW'),
                inline: true,
            },
            {
                name: language.joinedAt,
                value: author.joinedAt.toLocaleDateString('zh-TW'),
                inline: true,
            },
            {
                name: language.activity,
                value: activityDescription || 'None',
                inline: true,
            },
            {
                name: language.status,
                value: author?.presence?.status || 'Offline',
                inline: true,
            },
            {
                name: language.device,
                value: author?.presence?.clientStatus ? Object.keys(author.presence.clientStatus).join(', ') : 'None',
                inline: true,
            },
            {
                name: language.roles.replace('${author.roles.cache.size}', author.roles.cache.size),
                value: author.roles.cache.map((roles) => `${roles}`).join(', '),
                inline: false,
            },
        )
        .setTimestamp();
}
module.exports = {
    name: 'user-info',
    aliases: ['user', 'ui'],
    guildOnly: true,
    data: new SlashCommandBuilder()
        .setName('user-info')
        .setDescription('取得群組成員的基本資料')
        .setDescriptionLocalizations({
            'en-US': 'Get a user\'s information',
            'zh-CN': '取得群组成员的基本资料',
            'zh-TW': '取得群組成員的基本資料',
        })
        .addUserOption((option) => option
            .setName('member')
            .setDescription('群員的資料，如果没有指明群员，我将会发送你的資料')
            .setDescriptionLocalizations({
                'en-US': 'member\'s info, will send info about you if no arguments given',
                'zh-CN': '群员的资料，如果没有指明群员，我将会发送你的资料',
                'zh-TW': '群員的資料，如果没有指明群员，我将会发送你的資料',
            }),
        ),
    execute(interaction, language) {
        const user = interaction.options.getMember('member');
        if (!user) {
            return reply(interaction, { embeds: [getUserInfo(interaction.member, language)] });
        }
        return reply(interaction, { embeds: [getUserInfo(user, language)] });
    },
};
