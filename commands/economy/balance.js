module.exports = {
    name: "balance",
    cooldown: 10,
    aliases: ["bal"],
    description: "Check your balance.",
    async execute(message) {
        const { Users } = require("../../data/dbObjects");
        const { currency } = message.client;
        const storedBalances = await Users.findAll();
        storedBalances.forEach((b) => currency.set(b.user_id, b));
        const target = message.mentions.users.first() || message.author;
        return message.channel.send(`${target.tag} has ${currency.getBalance(target.id)}💰`);
    },
};
