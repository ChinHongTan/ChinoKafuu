const { prefix } = require('../config/config.json');

module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands'],
	usage: '[command name]',
	cooldown: 5,
	execute(message, args) {
		const Discord = require('discord.js');
		let embed = new Discord.MessageEmbed()
		.setTitle("ChinoKafuu Help")
		.setColor("0000FF")
		.setDescription("Here's a list of all my commands:")
		.addFields(
			{ name: "**General--8**", value: "\`avatar\`, \`beep\`, \`snipe\`, \`editsnipe\`, \`prune\`, \`server\`, \`user-info\`, \`help\`"},
			{ name: "**Music--5**", value: "\`play\`, \`stop\`, \`queue\`, \`skip\`, \`search\`"},
			{ name: "**Server backup(admin)--3**", value: "\`create\`, \`load\`, \`backup-info\`"},
			{ name: "**Images--3**", value: "\`fetch-image(admin)\`, \`loli\`, \`sauce\`"},
			{ name: "**NSFW--3**", value: "\`hentai\`, \`n\`, \`nhentai\`"},
			{ name: "**Invitation Link**", value: "[Click here](https://discord.com/api/oauth2/authorize?client_id=781328218753859635&permissions=8&redirect_uri=https%3A%2F%2Fdiscord.com%2Fapi%2Foauth2%2Fauthorize%3Fclient_id%3D781328218753859635%26permissions%3D8%26redirect_uri%3Dhttps%253A%252F%252Fdiscord.com%252Fapi%252Foauth2%252Fauthorize%253Fclient_id%253D781328&scope=bot%20applications.commands)"}
		)
		.setFooter("22 commands available")
		.setTimestamp();
		if (message.channel.type != 'dm') {
			message.channel.send(embed);
		};
		const data = [];
        const { commands } = message.client;

		if (!args.length) {
			data.push('Here\'s a list of all my commands:');
			data.push(commands.map(command => command.name).join(', '));
			data.push(`\nYou can send \`${prefix || process.env.PREFIX}help [command name]\` to get info on a specific command!`);

			return message.author.send(data, { split: true })
				.then(() => {
					if (message.channel.type === 'dm') return;
					message.reply('I\'ve sent you a DM with all my commands!');
				})
				.catch(error => {
					console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
					message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
				});
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply('that\'s not a valid command!');
		}

		data.push(`**Name:** ${command.name}`);

		if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
		if (command.description) data.push(`**Description:** ${command.description}`);
		if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

		data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

		message.channel.send(data, { split: true });
	},
};