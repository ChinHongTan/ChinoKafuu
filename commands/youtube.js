module.exports = {
    name: 'youtube',
    cooldown: 3,
	description: 'Watch youtube together!',
	execute(client, message, args) {
        const { DiscordTogether } = require('discord-together');

        client.discordTogether = new DiscordTogether(client);
        if (message.member.voice.channel) {
            client.discordTogether.createTogetherCode(message.member.voice.channelID, 'youtube').then(async invite => {
                return message.channel.send(`${invite.code}`);
            });
        };
	},
};
