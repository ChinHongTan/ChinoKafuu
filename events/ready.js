module.exports = {
	name: "ready",
	once: true,
	async execute(client) {
        console.log("Ready!");
        client.user.setPresence({
            activity: { name: "c!help", type: "LISTENING" },
            status: "dnd",
        });
	},
};