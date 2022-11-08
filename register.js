const { REST } = require('@discordjs/rest');
const fs = require('fs');
const { Routes } = require('discord-api-types/v9');
const clientId = process.env.CLIENT_ID || require('./config/config.json').clientId;
const token = process.env.TOKEN || require('./config/config.json').token;

const rest = new REST({ version: '9' }).setToken(token);
const commands = [];
const commandFolders = fs.readdirSync('./dist/commands');
for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./dist/commands/${folder}`).filter((file) => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./dist/commands/${folder}/${file}`);
        console.log(command);
        commands.push(command.data.toJSON());
    }
}

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();