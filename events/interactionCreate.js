const fs = require('fs');
const { reply } = require('../functions/Util.js');
const Discord = require('discord.js');
const owner_id = process.env.OWNERID || require('../config/config.json').owner_id;

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        // select menus does not contain command name, so customId is used
        // customId should be same as the name of the command
        const command = client.commands.get(interaction.commandName) ?? client.commands.get(interaction.customId);
        const collection = interaction.client.guildOptions;
        let rawData;
        if (collection) {
            rawData = await collection.findOne({ id: interaction?.guild?.id });
        } else {
            const buffer = fs.readFileSync('./data/guildOption.json', 'utf-8');
            const parsedJSON = JSON.parse(buffer);
            rawData = parsedJSON[interaction?.guild?.id];
        }
        const guildOption = rawData ?? {
            id: interaction?.guild?.id,
            options: { language: 'en_US' },
        };
        const language = client.language[guildOption.options.language][command.name];

        if (interaction.isAutocomplete()) {
            if (interaction.responded) return;
            return await command.slashCommand.autoComplete(interaction);
        }
        if (interaction.isSelectMenu()) {
            if (interaction.replied) return;
            // language provides the translated string, while guildOption.options.language provides the language
            // the 3rd param is not needed in most of the files
            return await command.slashCommand.selectMenu(interaction, language, guildOption.options.language);
        }
        if (!interaction.isCommand()) return;
        if (command.ownerOnly) {
            if (interaction.author.id !== owner_id) {
                return reply(interaction, { content: 'This command is only available for the bot owner!', ephemeral: true });
            }
        }

        if (command.permissions) {
            const authorPerms = interaction.channel.permissionsFor(interaction.user);
            if (!authorPerms || !authorPerms.has(command.permissions)) {
                return reply(interaction, {
                    content: `You cannot do this! Permission needed: ${command.permissions}`,
                    ephemeral: true,
                });
            }
        }

        if (!command) return;

        // command cool down
        const { coolDowns } = client;

        if (!coolDowns.has(command.name)) {
            coolDowns.set(command.name, new Discord.Collection());
        }

        const now = Date.now();
        const timestamps = coolDowns.get(command.name);
        const coolDownAmount = (command.coolDown || 3) * 1000;

        if (timestamps.has(interaction.user.id)) {
            const expirationTime = timestamps.get(interaction.user.id) + coolDownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return interaction.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
            }

            timestamps.set(interaction.user.id, now);
            setTimeout(() => timestamps.delete(interaction.user.id), coolDownAmount);
        }

        try {
            // language provides the translated string, while guildOption.options.language provides the language
            await command.slashCommand.execute(interaction, language, guildOption.options.language);
        } catch (error) {
            console.error(error);
            await reply(interaction, { content: 'There was an error while executing this command!', ephemeral: true });
        }
    },
};
