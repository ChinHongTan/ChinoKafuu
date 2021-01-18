module.exports = {
	name: 'user-info',
	aliases: ['user'],
	description: "User's information ",
	execute(message, args) {
		message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}\nDate created: ${message.author.createdAt}\nYour Tag: ${message.author.tag}`);
	},
};