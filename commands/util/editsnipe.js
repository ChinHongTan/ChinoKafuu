module.exports = {
    name: "editsnipe",
    aliases: ["esnipe"],
    guildOnly: true,
    description: {"en_US" : "Snipe an edited message.", "zh_CN" : "狙击已编辑的讯息"},
    async execute(message, args, language) {
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
                if (Number(args[0]) > 10) return message.channel.send(language.exceed10);
                let msg = editsnipes?.[Number(args[0]) - 1];
                if (!msg) return message.channel.send(language.invalidSnipe);
                let embed = new Discord.MessageEmbed()
                    .setColor("RANDOM")
                    .setAuthor(msg.author, msg.authorAvatar)
                    .setDescription(msg.content)
                    .setFooter(msg.timestamp);
                return message.channel.send(embed);
            }
        } else {
            return message.channel.send(language.noSnipe);
        }
    },
};
