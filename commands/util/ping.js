module.exports = {
    name: "ping",
    description: "Ping!",
    cooldown: 5,
    execute(message) {
        message.channel.send(`Websocket heartbeat: ${message.client.ws.ping}ms.`);
        let sent = await message.channel.send("Pinging...");
        sent.edit(`Roundtrip latency: ${sent.createdTimestamp - message.createdTimestamp}ms`);
    },
};
