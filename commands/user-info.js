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
			for(const profile of memberProfiles) {
				if (profile.name != message.author.username) continue;
				for (const [key, value] of Object.entries(profile)) {
					info += `${key} : ${value}\n`;
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