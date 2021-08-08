module.exports = {
    name: "youtube",
    cooldown: 3,
    description: {"en_US" : "Watch youtube together!", "zh_CN" : "一起看YouTube!"},
    async execute(message, _args, language) {
        const client = message.client;
        const { DiscordTogether } = require("discord-together");

        client.discordTogether = new DiscordTogether(client);
        if (message.member.voice.channel) {
            let invite = await client.discordTogether.createTogetherCode(message.member.voice.channelID, "youtube");
            return message.channel.send(`${invite.code}`);
        }
        message.channel.send(language.notInVC);
    },
};
