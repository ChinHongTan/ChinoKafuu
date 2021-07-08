module.exports = {
	name: 'user-info',
	aliases: ['user', 'ui'],
	guildOnly: true,
	description: "User's information ",
	execute(message) {
		const Discord = require('discord.js');

		function getUserInfo(author) {
            var activityDescription = '';
            if (author.presence.activities) {
                for (const activity of author.presence.activities) {
                    if (activity.type === "CUSTOM_STATUS") {
                        activityDescription += `__Custom Status__\n<:${activity.emoji.name}:${activity.emoji.id}> ${activity.state}\n`;
                    } else {
                        activityDescription += `__${activity.type}__\n${activity.name}\n${activity.details ? activity.details : ''}`;
                    }
                }
            } else {
                activityDescription = 'User is not playing.';
            }
            const embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('User Info')
                .setAuthor('蘿莉控們的FBI避難所', 'https://cdn.discordapp.com/icons/764839074228994069/a_0fd2b80512df6d23e33e9380da334b83.gif?size=256', 'https://loliconshelter.netlify.app/')
                .setThumbnail(author.user.displayAvatarURL({ format: "png", dynamic: true }))
                .addFields(
                    { name: 'Tag', value: author.user.tag, inline: true },
                    { name: 'Nickname', value: author.displayName, inline: true },
                    { name: 'ID', value: author.id, inline: true },
                    { name: 'Avatar URL', value: `[Click here](${author.user.displayAvatarURL({ format: "png", dynamic: true })})`, inline: true },
                    { name: 'Created At', value: author.user.createdAt.toLocaleDateString('zh-TW'), inline: true },
                    { name: 'Joined At', value: author.joinedAt.toLocaleDateString('zh-TW'), inline: true },
                    { name: "Activity", value: activityDescription ? activityDescription : 'None', inline: true },
                    { name: 'Status', value: author.presence.status, inline: true },
                    { name: 'Device', value: author.presence.clientStatus ? Object.keys(author.presence.clientStatus).join(', ') : 'None', inline: true },
                    { name: `Roles(${author.roles.cache.size})`, value: author.roles.cache.map(roles => `${roles}`).join(', '), inline: false }
                )
                .setTimestamp()
                .setFooter(`Last updated: ${timestamp}`);
				return embed;
		}
		if (!message.mentions.members.size) {
	    	let embed = getUserInfo(message.member);
			return message.channel.send(embed);
	    }

	    const userInfoList = message.mentions.members.map(user => {
	    	let embed = getUserInfo(user);
			return embed;
	    });
		message.channel.send(userInfoList);
	},
};