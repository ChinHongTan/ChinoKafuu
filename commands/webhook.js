module.exports = {
	name: 'webhook',
	aliases: ['w'],
	description: 'Create a webhook.',
	execute(message, args) {
		message.channel.createWebhook('智乃乃' , {
			name: message.author.username,
			avatar: message.author.avatarURL(),
		}).then((hook) => {
			hook.send(args.join(' '));
		});
		message.delete();
	},
};

