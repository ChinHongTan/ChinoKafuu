module.exports = {
    name: "snipe",
    guildOnly: true,
    description: "Snipe a message.",
    execute(message, args) {
        const fs = require("fs");
        const Discord = require("discord.js");

        let rawData = fs.readFileSync("./data/snipes.json");
        let snipeWithGuild = new Map(JSON.parse(rawData));
        let snipes;

        if (snipeWithGuild.has(message.guild.id)) {
            snipes = snipeWithGuild.get(message.guild.id);
        } else {
            return message.channel.send("There's nothing to snipe!");
        }
        let arg = args[0] ?? 1;

        if (Number(arg) > 10) return message.channel.send("You can't snipe beyond 10!");

        let image = snipes[Number(arg) - 1].attachments;

        let embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setAuthor(snipes[Number(arg) - 1].author, snipes[Number(arg) - 1].authorAvatar)
            .setDescription(snipes[Number(arg) - 1].content)
            .setFooter(snipes[Number(arg) - 1].timestamp)
            .setImage(image);
        return message.channel.send(embed);
    },
};
