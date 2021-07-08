module.exports = {
	name: 'shop',
	cooldown: 10,
	description: 'Show the shop items.',
	execute(message, args) {
		(async () => {
			const { CurrencyShop } = require('../data/dbObjects');
			const items = await CurrencyShop.findAll();
        	return message.channel.send(items.map(item => `${item.name}: ${item.cost}💰`).join('\n'), { code: true });
		})();
	},
};