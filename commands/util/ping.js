const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'ping',
    description: 'Ping!',
    cooldown: 5,
    async execute(message) {
        message.channel.send({ embeds: [{ description: `Websocket heartbeat: ${message.client.ws.ping}ms.`, color: 'BLUE' }] });
        const sent = await message.channel.send({ embeds: [{ description: 'Pinging...' }] });
        sent.edit({ embeds: [{ description: `Roundtrip latency: ${sent.createdTimestamp - message.createdTimestamp}ms`, color: 'BLUE' }] });
    },
    slashCommand: {
        data: new SlashCommandBuilder()
            .setName('ping')
            .setDescription('Ping!'),
        async execute(interaction) {
            const sent = await interaction.reply({
                embeds: [
                    { description: 'Pinging...', color: 'BLUE' },
                ],
                fetchReply: true,
            });
            await interaction.editReply({
                embeds: [
                    { description: `Websocket heartbeat: ${interaction.client.ws.ping}ms.`, color: 'BLUE' },
                    { description: `Roundtrip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`, color: 'BLUE' },
                ],
            });
        },
    },
};
