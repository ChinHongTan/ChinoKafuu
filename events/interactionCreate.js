module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;
        const collection = interaction.client.guildOptions;
        const rawData = await collection.findOne({ id: interaction?.guild?.id });
        const guildOption = rawData ?? {
            id: interaction?.guild?.id,
            options: { language: 'en_US' },
        };
        const language = client.language[guildOption.options.language];

        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.slashCommand.execute(interaction, language);
        }
        catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    },
};
