module.exports = {
    name: 'editsnipe',
    aliases: ['esnipe'],
	description: 'Snipe an edited message.',
	execute(message, args) {
		const fs = require('fs');
		const Discord = require('discord.js');

		let rawData = fs.readFileSync('./editSnipes.json');
		let editsnipes = JSON.parse(rawData);
		if (args.length < 1) {
			let embed = new Discord.MessageEmbed()
				.setColor('RANDOM')
				.setAuthor(editsnipes[0].author, editsnipes[0].authorAvatar)
				.setDescription(editsnipes[0].content)
				.setFooter(editsnipes[0].timestamp);
			return message.channel.send(embed);
		} else {
			let embed = new Discord.MessageEmbed()
				.setColor('RANDOM')
				.setAuthor(editsnipes[Number(args[0]) - 1].author, editsnipes[Number(args[0]) - 1].authorAvatar)
				.setDescription(editsnipes[Number(args[0]) - 1].content)
				.setFooter(editsnipes[Number(args[0]) - 1].timestamp);
			return message.channel.send(embed);
		};
	},
};