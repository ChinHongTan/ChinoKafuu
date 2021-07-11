module.exports = {
	name: 'balance',
	cooldown: 10,
	aliases: ['bal'],
	description: 'Check your balance.',
	// eslint-disable-next-line no-unused-vars
	async execute(client, message, args) {
			const target = message.mentions.users.first() || message.author;
			return message.channel.send(`${target.tag} has ${client.currency.getBalance(target.id)}💰`);
	},
};