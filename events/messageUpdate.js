const { storeEditSnipes } = require('../functions/eventFunctions');

module.exports = {
    name: 'messageUpdate',
    async execute(oldMessage, newMessage) {
        await storeEditSnipes(oldMessage, newMessage);
    },
};
