module.exports = {
    name: 'chess',
    cooldown: 3,
	description: 'Play chess together!',
	// eslint-disable-next-line no-unused-vars
	execute(client, message, args) {
        const { DiscordTogether } = require('discord-together');

        client.discordTogether = new DiscordTogether(client);
        if (message.member.voice.channel) {
            client.discordTogether.createTogetherCode(message.member.voice.channelID, 'chess').then(async invite => {
                return message.channel.send(`${invite.code}`);
            });
        }
	},
};