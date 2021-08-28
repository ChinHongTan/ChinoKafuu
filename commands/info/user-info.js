module.exports = {
    name: 'user-info',
    aliases: ['user', 'ui'],
    guildOnly: true,
    description: true,
    execute(message, _args, language) {
        const Discord = require('discord.js');

        function getUserInfo(author) {
            let activityDescription = '';
            if (author.presence.activities) {
                for (const activity of author.presence.activities) {
                    if (activity.type === 'CUSTOM_STATUS') {
                        activityDescription += language.customStatus.replace('${activity.emoji.name}', activity.emoji.name).replace('${activity.emoji.id}', activity.emoji.id).replace('${activity.state}', activity.state);
                    }
                    else {
                        activityDescription += language.gameStatus.replace('activity.type', activity.type).replace('${activity.name}', activity.name).replace('${activity.details ? activity.details : \'\'}', activity.details ? activity.details : '');
                    }
                }
            }
            else {
                activityDescription = language.notPlaying;
            }
            const embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('User Info')
                .setAuthor(
                    '蘿莉控們的FBI避難所',
                    'https://cdn.discordapp.com/icons/764839074228994069/a_0fd2b80512df6d23e33e9380da334b83.gif?size=256',
                    'https://loliconshelter.netlify.app/',
                )
                .setThumbnail(
                    author.user.displayAvatarURL({
                        format: 'png',
                        dynamic: true,
                    }),
                )
                .addFields(
                    { name: language.tag, value: author.user.tag, inline: true },
                    {
                        name: language.nickname,
                        value: author.displayName,
                        inline: true,
                    },
                    { name: language.id, value: author.id, inline: true },
                    {
                        name: language.avatarurl,
                        value: `[Click here](${author.user.displayAvatarURL({ format: 'png', dynamic: true })})`,
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
                        value: author.presence.status,
                        inline: true,
                    },
                    {
                        name: language.device,
                        value: author.presence.clientStatus ? Object.keys(author.presence.clientStatus).join(', ') : 'None',
                        inline: true,
                    },
                    {
                        name: language.roles.replace('${author.roles.cache.size}', author.roles.cache.size),
                        value: author.roles.cache.map((roles) => `${roles}`).join(', '),
                        inline: false,
                    },
                )
                .setTimestamp();
            return embed;
        }
        if (!message.mentions.members.size) {
            const embed = getUserInfo(message.member);
            return message.channel.send(embed);
        }

        const userInfoList = message.mentions.members.map((user) => {
            const embed = getUserInfo(user);
            return embed;
        });
        message.channel.send(userInfoList);
    },
};
