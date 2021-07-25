module.exports = {
    name: "balance",
    cooldown: 10,
    aliases: ["bal"],
    description: "Check your balance.",
    execute(message, args) {
        (async () => {
            const { Users } = require("../../data/dbObjects");
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
            const target = message.mentions.users.first() || message.author;
            return message.channel.send(
                `${target.tag} has ${currency.getBalance(target.id)}💰`
            );
        })();
    },
};
