module.exports = {
    name: "transfer",
    cooldown: 10,
    aliases: ["pay"],
    description: "Send the url of an avatar.",
    async execute(message, args) {
        const { Users } = require("../../data/dbObjects");
        const { currency } = message.client;
        const storedBalances = await Users.findAll();
        storedBalances.forEach((b) => currency.set(b.user_id, b));

        const currentAmount = currency.getBalance(message.author.id);
        const transferAmount = args[0];
        const transferTarget = message.mentions.users.first();

        if (!transferAmount || isNaN(transferAmount)) {
            return message.channel.send(`Sorry ${message.author}, that's an invalid amount.`);
        }
        if (transferAmount > currentAmount) {
            return message.channel.send(`Sorry ${message.author}, you only have ${currentAmount}.`);
        }
        if (transferAmount <= 0) {
            return message.channel.send(`Please enter an amount greater than zero, ${message.author}.`);
        }

        currency.add(message.author.id, -transferAmount);
        currency.add(transferTarget.id, transferAmount);

        return message.channel.send(`Successfully transferred ${transferAmount}💰 to ${transferTarget.tag}. Your current balance is ${currency.getBalance(message.author.id)}💰`);
    },
};
