module.exports = {
    name: 'editsnipe',
    aliases: ['esnipe'],
	guildOnly: true,
	description: 'Snipe an edited message.',
	execute(message, args) {
		const fs = require('fs');
		const Discord = require('discord.js');

		let rawData = fs.readFileSync('./data/editSnipes.json');
		let editSnipesWithGuild = new Map(JSON.parse(rawData));

		if (editSnipesWithGuild.has(message.guild.id)) {
			var editsnipes = editSnipesWithGuild.get(message.guild.id);
		} else {
			return message.channel.send("There's nothing to snipe!");
		}
		if (args.length < 1) {
			let embed = new Discord.MessageEmbed()
				.setColor('RANDOM')
				.setAuthor(editsnipes[0].author, editsnipes[0].authorAvatar)
				.setDescription(editsnipes[0].content)
				.setFooter(editsnipes[0].timestamp);
			return message.channel.send(embed);
		} else {
			if (Number(args[0]) > 10) return message.channel.send("You can't snipe beyond 10!")
			let embed = new Discord.MessageEmbed()
				.setColor('RANDOM')
				.setAuthor(editsnipes[Number(args[0]) - 1].author, editsnipes[Number(args[0]) - 1].authorAvatar)
				.setDescription(editsnipes[Number(args[0]) - 1].content)
				.setFooter(editsnipes[Number(args[0]) - 1].timestamp);
			return message.channel.send(embed);
		}
	},
};