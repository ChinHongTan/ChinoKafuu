module.exports = {
    name: "shop",
    cooldown: 10,
    description: {"en_US" : "Show the shop items.", "zh_CN" : "查看商店物品"},
    async execute(message, _args, language) {
        const { CurrencyShop } = require("../../data/dbObjects");
        const items = await CurrencyShop.findAll();
        return message.channel.send(
            items.map((item) => `${item.name}: ${item.cost}💰`).join("\n"),
            { code: true }
        );
    },
};
