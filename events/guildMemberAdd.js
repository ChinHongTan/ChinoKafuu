const { sendWelcomeMessage } = require("../functions/eventFunctions")

module.exports = {
	name: "voiceUpdate",
	async execute(member) {
        sendWelcomeMessage(member);
	},
};