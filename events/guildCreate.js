const { getGuildData, saveGuildData } = require('../functions/Util');

module.exports = {
    name: 'ready',
    once: true,
    async execute(guild) {
        // initialize guildData and save it into database
        const guildData = await getGuildData(guild.client, guild.id);
        guild.client.guildCollection.set(guild.id, guildData);
        await saveGuildData(guild.client, guild.id);
    },
};