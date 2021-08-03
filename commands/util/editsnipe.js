module.exports = {
    name: "editsnipe",
    aliases: ["esnipe"],
    guildOnly: true,
    description: "Snipe an edited message.",
    async execute(message, args) {
        const Discord = require("discord.js");
        const collection = message.client.editSnipeCollection;

        let editSnipesWithGuild = await collection.findOne({ id: message.guild.id });

        if (editSnipesWithGuild) {
            let editsnipes = editSnipesWithGuild.editSnipe;
            if (args.length < 1) {
                let embed = new Discord.MessageEmbed()
                    .setColor("RANDOM")
                    .setAuthor(editsnipes[0].author, editsnipes[0].authorAvatar)
                    .setDescription(editsnipes[0].content)
                    .setFooter(editsnipes[0].timestamp);
                return message.channel.send(embed);
            } else {
                if (Number(args[0]) > 10) return message.channel.send("You can't snipe beyond 10!");
                let msg = editsnipes?.[Number(args[0]) - 1];
                if (!msg) return message.channel.send("Not a valid snipe!");
                let embed = new Discord.MessageEmbed()
                    .setColor("RANDOM")
                    .setAuthor(msg.author, msg.authorAvatar)
                    .setDescription(msg.content)
                    .setFooter(msg.timestamp);
                return message.channel.send(embed);
            }
        } else {
            return message.channel.send("There's nothing to snipe!");
        }
    },
};
