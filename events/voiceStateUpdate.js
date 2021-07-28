const { dynamic } = require("../functions/eventFunctions");

module.exports = {
	name: "voiceUpdate",
	async execute(oldState, newState) {
        dynamic(oldState, newState);
	},
};