const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
    name: "ping",
    description: "Ping!",
    cooldown: 5,
    async execute(message) {
        message.channel.send(`Websocket heartbeat: ${message.client.ws.ping}ms.`);
        let sent = await message.channel.send("Pinging...");
        sent.edit(`Roundtrip latency: ${sent.createdTimestamp - message.createdTimestamp}ms`);
    },
    slashCommand: {
        data: new SlashCommandBuilder()
            .setName("ping")
            .setDescription("Ping!"),
        async execute(interaction) {
            let sent = await interaction.reply({
                embeds: [
                    {
                        description: "Pinging...",
                        color: "BLUE",
                    },
                ],
            });
            await interaction.editReply({
                embeds: [
                    {
                        description: `Websocket heartbeat: ${interaction.client.ws.ping}ms.`,
                        color: "BLUE",
                    },
                    {
                        description: `Roundtrip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`,
                        color: "BLUE",
                    },
                ],
            });
        },
    },
};
