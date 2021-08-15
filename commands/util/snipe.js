module.exports = {
    name: "snipe",
    guildOnly: true,
    description: true,
    async execute(message, args, language) {
        const Discord = require("discord.js");
        const collection = message.client.snipeCollection;

        let snipeWithGuild = await collection.findOne({ id: message.guild.id });
        let snipes;

        if (snipeWithGuild) {
            snipes = snipeWithGuild.snipes;
        } else {
            return message.channel.send(language.noSnipe);
        }
        let arg = args[0] ?? 1;

        if (Number(arg) > 10) return message.channel.send(language.exceed10);
        let msg = snipes?.[Number(arg) - 1];
        if (!msg) return message.channel.send(language.invalidSnipe);

        let image = msg.attachments;

        let embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setAuthor(msg.author, msg.authorAvatar)
            .setDescription(msg.content)
            .setFooter(msg.timestamp)
            .setImage(image);
        return message.channel.send(embed);
    },
};
