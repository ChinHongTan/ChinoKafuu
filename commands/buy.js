module.exports = {
	name: 'buy',
	cooldown: 10,
	description: 'Buy an item from the shop.',
	execute(message, args) {
        const { Op } = require('sequelize');
        const { Users, CurrencyShop } = require('../data/dbObjects');
        const Discord = require('discord.js');

		let currency = new Discord.Collection();
        Reflect.defineProperty(currency, 'getBalance', {
            /* eslint-disable-next-line func-name-matching */
            value: function getBalance(id) {
                const user = currency.get(id);
                return user ? user.balance : 0;
            },
        });
        Reflect.defineProperty(currency, 'add', {
            /* eslint-disable-next-line func-name-matching */
            value: async function add(id, amount) {
                const user = currency.get(id);
                if (user) {
                    user.balance += Number(amount);
                    return user.save();
                }
                const newUser = await Users.create({ user_id: id, balance: amount });
                currency.set(id, newUser);
                return newUser;
            },
        });
        (async () => {
            const storedBalances = await Users.findAll();
		    storedBalances.forEach(b => currency.set(b.user_id, b));
            const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: args[0] } } });
            if (!item) return message.channel.send(`That item doesn't exist.`);
            if (item.cost > currency.getBalance(message.author.id)) {
                return message.channel.send(`You currently have ${currency.getBalance(message.author.id)}, but the ${item.name} costs ${item.cost}!`);
            }

            const user = await Users.findOne({ where: { user_id: message.author.id } });
            currency.add(message.author.id, -item.cost);
            await user.addItem(item);

            message.channel.send(`You've bought: ${item.name}.`);
        })();
	},
};