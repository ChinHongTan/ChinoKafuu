const { CurrencyShop } = require('../data/dbObjects');
module.exports = {
	name: 'shop',
	cooldown: 10,
	description: 'Show the shop items.',
	async execute(client, message, args) {
			const items = await CurrencyShop.findAll();
			return message.channel.send(items.map(item => `${item.name}: ${item.cost}💰`).join('\n'), { code: true });
	},
};