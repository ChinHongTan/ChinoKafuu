module.exports = {
	name: 'user-info',
	aliases: ['user'],
	description: "User's information ",
	execute(message, args) {
		const fs = require('fs');
		const rawData = fs.readFileSync('./memberProfile.json');
		const memberProfiles = JSON.parse(rawData);
		message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}\nDate created: ${message.author.createdAt}\nYour Tag: ${message.author.tag}`);
		memberProfiles.forEach(profile => {
			if (profile.name != message.author.username) continue;
			message.channel.send(`User Info: ${JSON.stringify(profile, null, 2)}`)
		});
	},
};