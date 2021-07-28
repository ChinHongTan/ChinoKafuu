const { Users } = require("../data/dbObjects");

module.exports = {
	name: "ready",
	once: true,
	async execute(client) {
        const { currency } = client;
		const storedBalances = await Users.findAll();
        storedBalances.forEach((b) => currency.set(b.user_id, b));
        console.log("Ready!");
        client.user.setPresence({
            activity: { name: "c!help", type: "LISTENING" },
            status: "dnd",
        });
	},
};