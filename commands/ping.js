module.exports = {
	name: 'ping',
	description: 'Ping!',
	cooldown: 5,
	execute(message, args) {
		return message.channel.send(`Latency: **\`${this.client.ws.ping}ms\`**`);
	},
};
