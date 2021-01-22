module.exports = {
	name: 'snipe',
	description: 'Snipe a message.',
	execute(message, args) {
		const fs = require('fs');
		const Discord = require('discord.js');

		let rawData = fs.readFileSync('./snipes.json');
		let snipes = JSON.parse(rawData);
		if (args.length < 1) {
			let embed = new Discord.MessageEmbed()
				.setColor('RANDOM')
				.setAuthor(snipes[0].author, snipes[0].authorAvatar)
				.setDescription(snipes[0].content)
				.setFooter(snipes[0].timestamp);
			return message.channel.send(embed);
		} else {
			let embed = new Discord.MessageEmbed()
				.setColor('RANDOM')
				.setAuthor(snipes[Number(args[0]) - 1].author, snipes[Number(args[0]) - 1].authorAvatar)
				.setDescription(snipes[Number(args[0]) - 1].content)
				.setFooter(snipes[Number(args[0]) - 1].timestamp);
			return message.channel.send(embed);
		};
	},
};