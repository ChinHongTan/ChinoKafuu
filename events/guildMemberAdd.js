const { sendWelcomeMessage } = require('../functions/eventFunctions');

module.exports = {
    name: 'guildMEmberAdd',
    async execute(member) {
        sendWelcomeMessage(member);
    },
};
