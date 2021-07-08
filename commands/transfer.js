module.exports = {
    name: "transfer",
    cooldown: 10,
    aliases: ["pay"],
    description: "Send the url of an avatar.",
    execute(message, args) {
        (async () => {
            const { Users } = require("../data/dbObjects");
            const Discord = require("discord.js");
            let currency = new Discord.Collection();
            const storedBalances = await Users.findAll();
            storedBalances.forEach((b) => currency.set(b.user_id, b));
            Reflect.defineProperty(currency, "getBalance", {
                /* eslint-disable-next-line func-name-matching */
                value: function getBalance(id) {
                    const user = currency.get(id);
                    return user ? user.balance : 0;
                },
            });
            Reflect.defineProperty(currency, "add", {
                /* eslint-disable-next-line func-name-matching */
                value: async function add(id, amount) {
                    const user = currency.get(id);
                    if (user) {
                        user.balance += Number(amount);
                        return user.save();
                    }
                    const newUser = await Users.create({
                        user_id: id,
                        balance: amount,
                    });
                    currency.set(id, newUser);
                    return newUser;
                },
            });
            const currentAmount = currency.getBalance(message.author.id);
            const transferAmount = args[0];
            const transferTarget = message.mentions.users.first();

            if (!transferAmount || isNaN(transferAmount))
                return message.channel.send(
                    `Sorry ${message.author}, that's an invalid amount.`
                );
            if (transferAmount > currentAmount)
                return message.channel.send(
                    `Sorry ${message.author}, you only have ${currentAmount}.`
                );
            if (transferAmount <= 0)
                return message.channel.send(
                    `Please enter an amount greater than zero, ${message.author}.`
                );

            currency.add(message.author.id, -transferAmount);
            currency.add(transferTarget.id, transferAmount);

            return message.channel.send(
                `Successfully transferred ${transferAmount}💰 to ${
                    transferTarget.tag
                }. Your current balance is ${currency.getBalance(
                    message.author.id
                )}💰`
            );
        })();
    },
};
