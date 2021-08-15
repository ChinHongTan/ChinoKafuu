module.exports = {
    name: "buy",
    cooldown: 10,
    description: true,
    async execute(message, args, language) {
        const { Op } = require("sequelize");
        const { Users, CurrencyShop } = require("../../data/dbObjects");

        const { currency } = message.client;
        const item = await CurrencyShop.findOne({
            where: { name: { [Op.like]: args[0] } },
        });
        if (!item) return message.channel.send(language.noItem);
        if (item.cost > currency.getBalance(message.author.id)) {
            return message.channel.send(language.notEnoughMoney.replace("${currency.getBalance(message.author.id)}", currency.getBalance(message.author.id)).replace("${item.name}", item.name).replace("${item.cost}", item.cost));
        }

        const user = await Users.findOne({
            where: { user_id: message.author.id },
        });
        if (!user) return message.channel.send(language.notEnoughMoney.replace("${item.name}", item.name).replace("${item.cost}", item.cost));
        currency.add(message.author.id, -item.cost);
        await user.addItem(item);

        message.channel.send(language.buySucess.replace("${item.name}", item.name));
    },
};
