const { dynamic } = require('../functions/eventFunctions');

module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState) {
        dynamic(oldState, newState);
    },
};
