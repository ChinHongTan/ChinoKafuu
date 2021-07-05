module.exports = {
	name: 'shop',
	cooldown: 10,
	description: 'Show the shop items.',
	execute(client, message, args) {
		(async () => {
			const { CurrencyShop } = require('../dbObjects');
			const items = await CurrencyShop.findAll();
        	return message.channel.send(items.map(item => `${item.name}: ${item.cost}💰`).join('\n'), { code: true });
		})();
	},
};