module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        const { REST } = require('@discordjs/rest');
        const { Routes } = require('discord-api-types/v9');
        const fs = require('fs');
        const { clientId, token } = require('../config/config.json');
        console.log('Ready!');
        client.user.setPresence({
            activity: { name: 'c!help', type: 'LISTENING' },
        });
        const commands = [];
        const commandFolders = fs.readdirSync('./commands');
        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`./commands/${folder}`).filter((file) => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`../commands/${folder}/${file}`);
                if (command.slashCommand) {
                    const { data } = command.slashCommand;
                    if (!data.description) data.setDescription();
                    commands.push(command.slashCommand.data.toJSON());
                }
            }
        }
        const guilds = [];
        client.guilds.cache.each((guild) => guilds.push(guild.id));
        const rest = new REST({ version: '9' }).setToken(token);

        guilds.forEach((id) => {
            (async () => {
                try {
                    await rest.put(
                        Routes.applicationGuildCommands(clientId, id),
                        { body: commands },
                    );

                    console.log('Successfully registered application commands.');
                }
                catch (error) {
                    console.error(error);
                }
            })();
        });
    },
};
