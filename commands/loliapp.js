module.exports = {
    name: 'loliapp',
    cooldown: 3,
	description: 'Watch loli together!',
	execute(client, message, args) {
        const { DiscordTogether } = require('discord-together');

        client.discordTogether = new DiscordTogether(client);
        if (message.member.voice.channel) {
            client.discordTogether.createTogetherCode(message.member.voice.channelID, '848557649574101013').then(async invite => {
                return message.channel.send(`${invite.code}`);
            });
        };
	},
};