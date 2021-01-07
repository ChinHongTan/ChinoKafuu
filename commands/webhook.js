module.exports = {
	name: 'webhook',
	aliases: ['w'],
	description: 'Create a webhook.',
	execute(message, args) {
		message.channel.createWebhook('智乃乃' , {
			name: '智乃乃',
			avatar: 'https://cdn.discordapp.com/avatars/421585674710286337/f9c6adef6ee0a957819306c769337cd1.png?size=2048',
		}).then((hook) => {
			hook.send('蘋果金牌啦淦');
		});
	},
};

