module.exports = {
	name: 'beep',
	description: 'Beep!',
	execute(message, args) {
		return message.channel.send('Boop.');
	},
};
