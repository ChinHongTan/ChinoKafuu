module.exports = {
	name: 'user-info',
	aliases: ['user'],
	description: "User's information ",
	execute(message, args) {
		const fs = require('fs');

		function getUserInfo(author) {
			try{
				const rawData = fs.readFileSync('./memberProfile.json');
				const profileWithTimestamp = JSON.parse(rawData);
				const timestamp = Object.keys(profileWithTimestamp)[0];
				const memberProfiles = profileWithTimestamp[Object.keys(profileWithTimestamp)[0]];
				message.channel.send(`Your username: ${author.username}\nYour ID: ${author.id}\nDate created: ${author.createdAt}\nYour Tag: ${author.tag}`);
				var info = '';
				var description = '';
				for(const profile of memberProfiles) {
					console.log(JSON.stringify([profile, null, 2]));
					if (profile.name != author.username) continue;
					for (const [key, value] of Object.entries(profile)) {
						description = value;
						if (typeof value === 'object' && value !== null) {
							description = '';
							for (const [channelName, total] of Object.entries(value)) {
								description += `${channelName} : ${total}\n`;
							};
						};
						info += `__${key}__\n${description}\n`;
					};
					break;
				};
				return {
					info,
					timestamp
				};
			} catch (error) {
				console.error(error);
				return message.channel.send("An error occured when reading the file!");
			};
		};
		if (!message.mentions.users.size) {
	    	let { info, timestamp } = getUserInfo(message.author);
			return message.channel.send(`User Info:\n${info}\nLast Updated: ${timestamp}`);
	    };

	    const userInfoList = message.mentions.users.map(user => {
	    	let { info, timestamp } = getUserInfo(user);
			return `User Info:\n${info}\nLast Updated: ${timestamp}`;
	    });
		message.channel.send(userInfoList);
	},
};