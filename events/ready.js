const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const clientId = process.env.CLIENT_ID || require('../config/config.json').clientId;
const channelId = process.env.CHANNEL_ID || require('../config/config.json').channelId;
const token = process.env.TOKEN || require('../config/config.json').token;
const util = require('util');
const Util = require('../functions/Util.js');

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
            activity: { name: 'c!help', type: 'LISTENING' },
        });
        const rest = new REST({ version: '9' }).setToken(token);

        const guilds = [];
        client.guilds.cache.each((guild) => guilds.push(guild.id));

        for (const id of guilds) {
            const collection = client.guildOptions;
            let rawData;
            if (collection) {rawData = await collection.findOne({ id });} else {
                const buffer = fs.readFileSync('./data/guildOption.json', 'utf-8');
                const parsedJSON = JSON.parse(buffer);
                rawData = parsedJSON[id];
            }
            const guildOption = rawData ?? {
                id,
                options: { language: 'en_US' },
            };
            const language = guildOption.options.language;
            const commands = [];
            const commandFolders = fs.readdirSync('./commands');
            for (const folder of commandFolders) {
                const commandFiles = fs.readdirSync(`./commands/${folder}`).filter((file) => file.endsWith('.js'));
                for (const file of commandFiles) {
                    const command = require(`../commands/${folder}/${file}`);
                    const data = Util.processCommand(command, language);
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
