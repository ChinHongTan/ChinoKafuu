module.exports = {
	name: 'user-info',
	aliases: ['user'],
	description: "User's information ",
	execute(message, args) {
		const fs = require('fs');
		try{
			const rawData = fs.readFileSync('./memberProfile.json');
			const profileWithTimestamp = JSON.parse(rawData);
			const timestamp = Object.keys(profileWithTimestamp)[0];
			const memberProfiles = profileWithTimestamp[Object.keys(profileWithTimestamp)[0]];
			message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}\nDate created: ${message.author.createdAt}\nYour Tag: ${message.author.tag}`);
			var info = '';
			var description = '';
			for(const profile of memberProfiles) {
				console.log(JSON.stringify([profile, null, 2]));
				if (profile.name != message.author.username) continue;
				for (const [key, value] of Object.entries(profile)) {
					description = value;
					if (typeof value === 'object' && value !== null) {
						description = '';
						for (const [channelName, total] of Object.entries(value)) {
							description += `${channelName} : ${total}\n`
						};
					};
					info += `__${key}__\n${description}\n`;
				};
				message.channel.send(`User Info: ${info}`);
				break;
			};
			return message.channel.send(`Last updated: ${timestamp}`); 
		} catch (error) {
			console.error(error);
			return message.channel.send("An error occured when reading the file!");
		}
	},
};