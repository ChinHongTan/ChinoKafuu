module.exports = {
	name: 'ping',
	description: 'Ping!',
	execute(message, args) {
		return message.channel.send(`Latency: **\`${this.client.ws.ping}ms\`**`);
	},
};
