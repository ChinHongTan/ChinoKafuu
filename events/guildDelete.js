const { deleteGuildData } = require('../functions/Util');

module.exports = {
    name: 'ready',
    once: true,
    async execute(guild) {
        // delete info about the guild
        await deleteGuildData(guild.client, guild.id);
    },
};