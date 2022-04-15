const fs = require('fs');
const { reply } = require('../functions/commandReply.js');
module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        const command = client.commands.get(interaction.commandName);

        if (interaction.isAutocomplete()) {
            await command.slashCommand.autoComplete(interaction);
        }
        if (!interaction.isCommand()) return;
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
        const language = client.language[guildOption.options.language];

        if (!command) return;

        try {
            await command.slashCommand.execute(interaction, language);
        } catch (error) {
            console.error(error);
            await reply(interaction, { content: 'There was an error while executing this command!', ephemeral: true });
        }
    },
};
