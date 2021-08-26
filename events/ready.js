module.exports = {
	name: "ready",
	once: true,
	async execute(client) {
        const { REST } = require('@discordjs/rest');
        const { Routes } = require('discord-api-types/v9');
        const fs = require('fs');
        const { clientId, guildId, token } = require('../config/config.json');
        const Discord = require("discord.js");
        console.log("Ready!");
        client.user.setPresence({
            activity: { name: "c!help", type: "LISTENING" },
        });
        const commands = [];
        const commandFolders = fs.readdirSync("./commands");
        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith(".js"));
            for (const file of commandFiles) {
                const command = require(`../commands/${folder}/${file}`);
                if (command.slashCommand) {
                    let data = command.slashCommand.data;
                    if (!data.description) data.setDescription()
                    commands.push(command.slashCommand.data.toJSON())
                };
            }
        }
        let guilds = [];
        client.guilds.cache.each(guild => guilds.push(guild.id));
        console.log(guilds);
        const rest = new REST({ version: '9' }).setToken(token);

        guilds.forEach(id => {
            (async () => {
                try {
                    await rest.put(
                        Routes.applicationGuildCommands(clientId, id),
                        { body: commands },
                    );
        
                    console.log('Successfully registered application commands.');
                } catch (error) {
                    if (error.message === "DiscordAPIError[50001]: Missing Access") console.log("Missing access");
                    else console.error(error);
                }
            })();
        });
	},
};