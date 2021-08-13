module.exports = {
    name: "help",
    description: {"en_US" : "List all of my commands or info about a specific command.", "zh_CN" : "列出我所有的指令/指令详情"},
    aliases: ["commands"],
    usage: "[command name]",
    cooldown: 5,
    execute(message, args, language) {
        const prefix = process.env.PREFIX || require("../../config/config.json").prefix;
        const { commands } = message.client;
        const Discord = require("discord.js");

        if (!args.length) {
            let embed = new Discord.MessageEmbed()
                .setTitle(language.helpTitle)
                .setDescription(language.helpPrompt + '\n' + language.helpPrompt2.replace("${prefix}", prefix))
                .setColor("BLUE")
                .setThumbnail(message.client.user.displayAvatarURL());
            commands.forEach((command) => {
                embed.addField(command.name, language[command.name] || command.description, true)
            })

            return message.author
                .send({ split: true , embed: embed})
                .then(() => {
                    if (message.channel.type === "dm") return;
                    message.reply(language.helpSend);
                })
                .catch((error) => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.reply(language.cantDM);
                });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find((c) => c.aliases && c.aliases.includes(name));

        if (!command) return message.reply(language.invalidcmd);
        let embed = new Discord.MessageEmbed()
            .setTitle(`**${command.name}**`)
            .setThumbnail(message.client.user.displayAvatarURL())
            .setColor("BLUE")
            .addField(language.cmdName, command.name, true)
            .addField(language.cmdAliases, command?.aliases?.join(', ') || "None", true)
            .addField(language.cmdDescription, language[command.name])
            .addField(language.cmdUsage, `${prefix}${command.name} ${command.usage || ""}`, true)
            .addField(language.cmdCooldown, command.cooldown || 3, true)

        message.channel.send(embed, { split: true });
    },
};
