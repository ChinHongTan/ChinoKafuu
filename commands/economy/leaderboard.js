module.exports = {
    name: "leaderboard",
    cooldown: 10,
    description: {"en_US" : "Show the leaderboard.", "zh_CN" : "查看金钱排行榜"},
    async execute(message, _args, language) {
        const { currency } = message.client;
        return message.channel.send(
            currency.sort((a, b) => b.balance - a.balance)
                    .filter((user) =>message.client.users.cache.has(user.user_id))
                    .first(10)
                    .map((user, position) => `(${position + 1}) ${message.client.users.cache.get(user.user_id).tag}: ${user.balance}💰`)
                    .join("\n"),
            { code: true }
        );
    },
};
