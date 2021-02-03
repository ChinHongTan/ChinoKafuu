const { Channel } = require("discord.js");

module.exports = {
	name: 'beep',
	description: 'Beep!',
	execute(message, args) {
		message.channel.send("Boop");
	},
};