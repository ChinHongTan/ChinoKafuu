module.exports = {
    name: 'fishing',
    cooldown: 3,
	description: 'Fish together!',
	execute(message, args) {
        const Discord = require('discord.js');
        const client = new Discord.Client();
        const { DiscordTogether } = require('discord-together');

        client.discordTogether = new DiscordTogether(client);
        if (message.member.voice.channel) {
            client.discordTogether.createTogetherCode(message.member.voice.channelID, 'fishing').then(async invite => {
                return message.channel.send(`${invite.code}`);
            });
        };
	},
};