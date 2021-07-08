module.exports = {
	name: 'webhook',
	aliases: ['w'],
	description: 'Create a webhook.',
	execute(message, args) {
		message.channel.createWebhook(message.author.username, {
			name: message.author.username,
			avatar: message.author.avatarURL(),
		}).then((hook) => {
			hook.send(args.join(' '));
		});
		message.delete();
	},
};

