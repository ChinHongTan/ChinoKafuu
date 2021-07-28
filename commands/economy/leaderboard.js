module.exports = {
    name: "leaderboard",
    cooldown: 10,
    description: "Show the leaderboard.",
    async execute(message) {
        const { Users } = require("../../data/dbObjects");
        const { currency } = message.client;
        const storedBalances = await Users.findAll();
        storedBalances.forEach((b) => currency.set(b.user_id, b));
        return message.channel.send(
            currency.sort((a, b) => b.balance - a.balance)
                    .filter((user) =>message.client.users.cache.has(user.user_id))
                    .first(10)
                    .map((user, position) =>`(${position + 1}) ${message.client.users.cache.get(user.user_id).tag}: ${user.balance}💰`)
                    .join("\n"),
            { code: true }
        );
    },
};
