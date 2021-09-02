module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        const { REST } = require('@discordjs/rest');
        const { Routes } = require('discord-api-types/v9');
        const fs = require('fs');
        const clientId = process.env.CLIENT_ID || require('../config/config.json');
        const token = process.env.TOKEN || require('../config/config.json');
        console.log('Ready!');
        client.user.setPresence({
            activity: { name: 'c!help', type: 'LISTENING' },
        });
        const rest = new REST({ version: '9' }).setToken(token);

        const guilds = [];
        client.guilds.cache.each((guild) => guilds.push(guild.id));

        for (const id of guilds) {
            const collection = client.guildOptions;
            const rawData = await collection.findOne({ id });
            const guildOption = rawData ?? {
                id,
                options: { language: 'en_US' },
            };
            const language = client.language[guildOption.options.language];
            const commands = [];
            const commandFolders = fs.readdirSync('./commands');
            for (const folder of commandFolders) {
                const commandFiles = fs.readdirSync(`./commands/${folder}`).filter((file) => file.endsWith('.js'));
                for (const file of commandFiles) {
                    const command = require(`../commands/${folder}/${file}`);
                    if (command.slashCommand) {
                        const { data } = command.slashCommand;
                        data.setName(command.name);
                        data.setDescription(language[command.name] ?? 'none');
                        commands.push(command.slashCommand.data.toJSON());
                    }
                }
            }
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
        }
        const { generateDependencyReport } = require('@discordjs/voice');

        console.log(generateDependencyReport());
    },
};
