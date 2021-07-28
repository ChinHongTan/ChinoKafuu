const { storeSnipes } = require("../functions/eventFunctions")

module.exports = {
	name: "messageDelete",
	async execute(message) {
        storeSnipes(message);
	},
};