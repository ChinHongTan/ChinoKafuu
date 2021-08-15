module.exports = {
    name: "shop",
    cooldown: 10,
    description: true,
    async execute(message, _args, language) {
        const { CurrencyShop } = require("../../data/dbObjects");
        const items = await CurrencyShop.findAll();
        return message.channel.send(
            items.map((item) => `${item.name}: ${item.cost}💰`).join("\n"),
            { code: true }
        );
    },
};
