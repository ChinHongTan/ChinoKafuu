module.exports = {
    name: "balance",
    cooldown: 10,
    aliases: ["bal"],
    description: true,
    async execute(message, _args, language) {
        const { Users } = require("../../data/dbObjects");
        const { currency } = message.client;
        const storedBalances = await Users.findAll();
        storedBalances.forEach((b) => currency.set(b.user_id, b));
        const target = message.mentions.users.first() || message.author;
        return message.channel.send(language.userBalance.replace("${target.tag}", target.tag).replace("${currency.getBalance(target.id)}", currency.getBalance(target.id)));
    },
};
