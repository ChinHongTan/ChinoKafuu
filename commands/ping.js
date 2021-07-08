module.exports = {
	name: 'ping',
	description: 'Ping!',
	cooldown: 5,
	execute(message, args) {
		message.channel.send(`Websocket heartbeat: ${message.client.ws.ping}ms.`);
		message.channel.send('Pinging...').then(sent => {
			sent.edit(`Roundtrip latency: ${sent.createdTimestamp - message.createdTimestamp}ms`);
		});
	},
};