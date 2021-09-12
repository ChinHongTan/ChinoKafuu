const { dynamic } = require('../functions/eventFunctions');

module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState) {
        await dynamic(oldState, newState);
    },
};
