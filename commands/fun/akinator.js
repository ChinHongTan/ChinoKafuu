module.exports = {
    name: 'akinator',
    description: 'Play an akinator game!',
    guildOnly: true,
    async execute(message) {
        const akinator = require('discord.js-akinator');
        akinator(message, {
            language: 'en',
            childMode: false,
            useButtons: true,
        });
    },
};
