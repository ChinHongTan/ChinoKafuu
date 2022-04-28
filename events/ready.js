const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Collection } = require('discord.js');
const fs = require('fs');
const clientId = process.env.CLIENT_ID || require('../config/config.json').clientId;
const channelId = process.env.CHANNEL_ID || require('../config/config.json').channelId;
const token = process.env.TOKEN || require('../config/config.json').token;
const util = require('util');
const { processCommand, getGuildData, saveGuildData } = require('../functions/Util.js');

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
        const rest = new REST({ version: '9' }).setToken(token);

        const guilds = [];
        client.guilds.cache.each((guild) => guilds.push(guild.id));
        client.guildCollection = new Collection();

        for (const id of guilds) {
            const guildData = await getGuildData(client, id);

            // save guild options into a collection
            client.guildCollection.set(id, guildData);

            await saveGuildData(client, id);
            const language = guildData.data.language;
            const commands = [];
            const commandFolders = fs.readdirSync('./commands');
            for (const folder of commandFolders) {
                const commandFiles = fs.readdirSync(`./commands/${folder}`).filter((file) => file.endsWith('.js'));
                for (const file of commandFiles) {
                    const command = require(`../commands/${folder}/${file}`);
                    const data = processCommand(command, language);
                    commands.push(data.toJSON());
                }
            }
            try {
                await rest.put(
                    Routes.applicationGuildCommands(clientId, id),
                    { body: commands },
                );

                console.log('Successfully registered application commands.');
            } catch (error) {
                console.error(`Missing access: ${error} for ID: ${id}`);
            }
        }
    },
};
