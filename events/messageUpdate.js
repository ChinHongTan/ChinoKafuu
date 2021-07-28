const { storeEditSnipes } = require("../functions/eventFunctions")

module.exports = {
	name: "messageUpdate",
	async execute(oldMessage, newMessage) {
        storeEditSnipes(oldMessage, newMessage);
	},
};