module.exports = {
    name: "server",
    aliases: ["server-info"],
    description: "Information about server.",
    guildOnly: true,
    cooldown: 5,
    execute(message) {
        const Discord = require("discord.js");
        const embed = new Discord.MessageEmbed()
            .setTitle("Server Info")
            .setThumbnail(message.guild.iconURL())
            .setDescription(`Information about ${message.guild.name}`)
            .setColor("BLUE")
            .setAuthor(`${message.guild.name} Info`, message.guild.iconURL())
            .addFields(
                { name: "Server name", value: message.guild.name, inline: true },
                { name: "Server owner", value: message.guild.owner, inline: true },
                { name: "Member count", value: message.guild.memberCount, inline: true },
                { name: "Region", value: message.guild.region, inline: true },
                { name: "Hightst role", value: message.guild.roles.highest, inline: true },
                { name: "Server creation", value: message.guild.createdAt, inline: true },
                { name: "Channels count", value: message.guild.channels.cache.size, inline: true },
            )
            .setFooter("ChinoKafuu | Server Info", message.client.user.displayAvatarURL());
        message.channel.send(embed);
    },
};
