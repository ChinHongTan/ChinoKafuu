module.exports = {
    name: "server",
    aliases: ["server-info"],
    description: "Information about server.",
    guildOnly: true,
    cooldown: 5,
    execute(message) {
        message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}\nDate created: ${message.guild.createdAt}\nServer region: ${message.guild.region}\nTotal channels: ${message.guild.channels}`);
    },
};
