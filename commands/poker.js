const { DiscordTogether } = require('discord-together');
module.exports = {
    name: 'poker',
    cooldown: 3,
	description: 'Play poker together!',
	execute(client, message, args) {
        client.discordTogether = new DiscordTogether(client);
        if (message.member.voice.channel) {
            client.discordTogether.createTogetherCode(message.member.voice.channelID, 'poker').then(async invite => {
                return message.channel.send(`${invite.code}`);
            });
        }
	},
};