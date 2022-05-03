import { REST } from '@discordjs/rest';
import fs from 'fs';
import { Routes } from 'discord-api-types/v9';
import { processCommand } from './functions/Util';
const clientId = process.env.CLIENT_ID || require('./config/config.json').clientId;
const token = process.env.TOKEN || require('./config/config.json').token;
const guildId = process.env.GUILD_ID || require('./config/config.json').token;

const rest = new REST({ version: '9' }).setToken(token);
const commands = [];
const commandFolders = fs.readdirSync('./commands');
for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter((file) => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`../commands/${folder}/${file}`);
        const data = processCommand(command, 'zh_TW');
        commands.push(data.toJSON());
    }
}

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        if (guildId) {
            await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: commands },
            );
        }

        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();