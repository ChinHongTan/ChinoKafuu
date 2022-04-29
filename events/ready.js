const { Collection } = require('discord.js');
const channelId = process.env.CHANNEL_ID || require('../config/config.json').channelId;
const util = require('util');
const { registerCommand, getGuildData, saveGuildData } = require('../functions/Util.js');
const { getUserData, saveUserData } = require('../functions/Util');

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

        const guilds = [];
        client.guilds.cache.each((guild) => guilds.push(guild.id));
        client.guildCollection = new Collection();
        client.userCollection = new Collection();
        const userList = await client.userDatabase.find().toArray();
        for (const user of userList) {
            const userData = await getUserData(client, user.id);
            client.userCollection.set(user.id, userData);
            await saveUserData(client, user.id);
        }

        for (const id of guilds) {
            const guildData = await getGuildData(client, id);

            // save guild options into a collection
            client.guildCollection.set(id, guildData);

            await saveGuildData(client, id);
            const language = guildData.data.language;
            await registerCommand(id, language);
        }
    },
};
