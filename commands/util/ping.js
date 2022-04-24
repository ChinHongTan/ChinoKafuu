module.exports = {
    name: 'ping',
    description: {
        'en_US': 'Get my latency~',
        'zh_CN': '取得我的网络延迟~',
        'zh_TW': ' 取得我的網絡延遲~',
    },
    coolDown: 5,
    async execute(message, _, language) {
        message.channel.send({ embeds: [{ description: `${language.heartbeat} ${message.client.ws.ping}ms.`, color: 'BLUE' }] });
        const sent = await message.channel.send({ embeds: [{ description: language.pinging }] });
        sent.edit({ embeds: [{ description: `${language.latency} ${sent.createdTimestamp - message.createdTimestamp}ms`, color: 'BLUE' }] });
    },
    slashCommand: {
        async execute(interaction, language) {
            const sent = await interaction.reply({
                embeds: [
                    { description: language.pinging, color: 'BLUE' },
                ],
                fetchReply: true,
            });
            await interaction.editReply({
                embeds: [
                    { description: `${language.heartbeat} ${interaction.client.ws.ping}ms.`, color: 'BLUE' },
                    { description: `${language.latency} ${sent.createdTimestamp - interaction.createdTimestamp}ms`, color: 'BLUE' },
                ],
            });
        },
    },
};
