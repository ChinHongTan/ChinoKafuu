module.exports = {
	name: 'inventory',
	cooldown: 10,
	aliases: ['inv'],
	description: 'Show your inventory.',
	async execute(client, message, args) {
		const { Users } = require('../data/dbObjects');
		const target = message.mentions.users.first() || message.author;
		const user = await Users.findOne({
			where: {
				user_id: target.id
			}
		});
		const items = await user.getItems();

		if (!items.length) return message.channel.send(`${target.tag} has nothing!`);
		return message.channel.send(`${target.tag} currently has ${items.map(i => `${i.amount} ${i.item.name}`).join(', ')}`);
	},
};