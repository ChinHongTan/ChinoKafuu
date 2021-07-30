module.exports = {
    name: "buy",
    cooldown: 10,
    description: "Buy an item from the shop.",
    async execute(message, args) {
        const { Op } = require("sequelize");
        const { Users, CurrencyShop } = require("../../data/dbObjects");

        const { currency } = message.client;
        const item = await CurrencyShop.findOne({
            where: { name: { [Op.like]: args[0] } },
        });
        if (!item) return message.channel.send("That item doesn't exist.");
        if (item.cost > currency.getBalance(message.author.id)) {
            return message.channel.send(`You currently have ${currency.getBalance(message.author.id)}, but the ${item.name} costs ${item.cost}!`);
        }

        const user = await Users.findOne({
            where: { user_id: message.author.id },
        });
        if (!user) return message.channel.send(`You don't have enough money to buy ${item.name} which costs ${item.cost}!`);
        currency.add(message.author.id, -item.cost);
        await user.addItem(item);

        message.channel.send(`You've bought: ${item.name}.`);
    },
};
