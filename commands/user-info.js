module.exports = {
	name: 'user-info',
	aliases: ['user'],
	description: "User's information ",
	execute(message, args) {
		const fs = require('fs');
		const Discord = require('discord.js');

		function getUserInfo(author) {
			try{
				const rawData = fs.readFileSync('./memberProfile.json');
				const profileWithTimestamp = JSON.parse(rawData);
				const timestamp = Object.keys(profileWithTimestamp)[0];
				const memberProfiles = profileWithTimestamp[Object.keys(profileWithTimestamp)[0]];

				var description = '';
				var activityDescription = '';
				for (const profile of memberProfiles) {
					if (profile.name === author.user.username) {
						for (const [key, value] of Object.entries(profile)) {
							if (typeof value === 'object' && value !== null) {
								description = '';
								for (const [channelName, total] of Object.entries(value)) {
									description += `${channelName} : ${total}\n`;
								};
							};
							if (key === 'total') {
								description += `\nTotal : ${value}`;
							};
						};
						break;
					} else {
						description = 'None';
					};
				};
				if (author.presence.activities) {
					for (const activity of author.presence.activities) {
						if (activity.type === "CUSTOM_STATUS") {
							activityDescription += `__Custom Status__\n<:${activity.emoji.name}:${activity.emoji.id}> ${activity.state}\n`;
						} else {
							activityDescription += `__${activity.type}__\n${activity.name}\n${activity.details ? activity.details : ''}`;
						};
					};
				} else {
					activityDescription = 'User is not playing.'
				}
				console.log(author.presence.activities);
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
						{ name: "Activity", value: `${activityDescription}`, inline: true },
						{ name: 'Status', value: author.presence.status, inline: true },
						{ name: 'Device', value: Object.keys(author.presence.clientStatus).join(', '), inline: true },
						{ name: 'Images send', value: description, inline: true },
						{ name: `Roles(${author.roles.cache.size})`, value: author.roles.cache.map(roles => `${roles}`).join(', '), inline: false }
					)
					.setTimestamp()
					.setFooter(`Last updated: ${timestamp}`);

				return embed;
			} catch (error) {
				console.error(error);
				return message.channel.send("An error occured when reading the file!");
			};
		};
		if (!message.mentions.members.size) {
	    	let embed = getUserInfo(message.member);
			return message.channel.send(embed);
	    };

	    const userInfoList = message.mentions.members.map(user => {
	    	let embed = getUserInfo(user);
			return embed;
	    });
		message.channel.send(userInfoList);
	},
};