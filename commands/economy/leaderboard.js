module.exports = {
    name: "leaderboard",
    cooldown: 10,
    description: "Show the leaderboard.",
    execute(message) {
        (async () => {
            const Discord = require("discord.js");
            const { Users } = require("../../data/dbObjects");
            let currency = new Discord.Collection();
            const storedBalances = await Users.findAll();
            storedBalances.forEach((b) => currency.set(b.user_id, b));
            return message.channel.send(
                currency
                    .sort((a, b) => b.balance - a.balance)
                    .filter((user) =>
                        message.client.users.cache.has(user.user_id)
                    )
                    .first(10)
                    .map(
                        (user, position) =>
                            `(${position + 1}) ${
                                message.client.users.cache.get(user.user_id).tag
                            }: ${user.balance}💰`
                    )
                    .join("\n"),
                { code: true }
            );
        })();
    },
};
