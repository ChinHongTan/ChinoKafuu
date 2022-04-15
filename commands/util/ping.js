const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'ping',
    description: {
        'en_US': 'Get my latency~',
        'zh_CN': '取得我的网络延迟~',
        'zh_TW': ' 取得我的網絡延遲~',
    },
    cooldown: 5,
    async execute(message) {
        message.channel.send({ embeds: [{ description: `Websocket heartbeat: ${message.client.ws.ping}ms.`, color: 'BLUE' }] });
        const sent = await message.channel.send({ embeds: [{ description: 'Pinging...' }] });
        sent.edit({ embeds: [{ description: `Roundtrip latency: ${sent.createdTimestamp - message.createdTimestamp}ms`, color: 'BLUE' }] });
    },
    slashCommand: {
        data: new SlashCommandBuilder()
            .setName('ping')
            .setDescription('Ping!淦'),
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
