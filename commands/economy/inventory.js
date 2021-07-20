module.exports = {
    name: "inventory",
    cooldown: 10,
    aliases: ["inv"],
    description: "Show your inventory.",
    execute(message, args) {
        const { Users } = require("../data/dbObjects");
        const Discord = require("discord.js");
        let currency = new Discord.Collection();
        (async () => {
            const storedBalances = await Users.findAll();
            storedBalances.forEach((b) => currency.set(b.user_id, b));
            const target = message.mentions.users.first() || message.author;
            const user = await Users.findOne({ where: { user_id: target.id } });
            const items = await user.getItems();

            if (!items.length)
                return message.channel.send(`${target.tag} has nothing!`);
            return message.channel.send(
                `${target.tag} currently has ${items
                    .map((i) => `${i.amount} ${i.item.name}`)
                    .join(", ")}`
            );
        })();
    },
};
