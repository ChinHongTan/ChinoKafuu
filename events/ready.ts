const { Collection } = require('discord.js');
const channelId = process.env.CHANNEL_ID || require('../config/config.json').channelId;
const util = require('util');
const { getGuildData, saveGuildData } = require('../functions/Util.js');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        // when running on heroku, log to discord channel
        if (process.argv[2] === '-r' && channelId) {
            console.log = async function(d) {
                const logChannel = await client.channels.fetch(channelId);
                await logChannel.send(util.format(d) + '\n');
            };

            console.error = async function(d) {
                const logChannel = await client.channels.fetch(channelId);
                await logChannel.send(util.format(d) + '\n');
            };
        }

        console.log('Ready!');
        client.user.setPresence({
            activities: [{ name: 'c!help', type: 'LISTENING' }],
        });

        client.guildCollection = new Collection();

        await Promise.all(client.guilds.cache.map(async (guild) => {
            const guildData = await getGuildData(client, guild.id);

            // save guild options into a collection
            client.guildCollection.set(guild.id, guildData);

            await saveGuildData(client, guild.id);
        }));
    },
};
