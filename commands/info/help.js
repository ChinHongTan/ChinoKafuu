module.exports = {
    name: "help",
    description: {"en_US" : "List all of my commands or info about a specific command.", "zh_CN" : "列出我所有的指令/指令详情"},
    aliases: ["commands"],
    usage: "[command name]",
    cooldown: 5,
    execute(message, args, language) {
        const prefix = process.env.PREFIX || require("../../config/config.json").prefix;
        const data = [];
        const { commands } = message.client;

        if (!args.length) {
            data.push(language.helpPrompt);
            data.push(commands.map((command) => command.name).join(", "));
            data.push(language.helpPrompt2.replace("${prefix || process.env.PREFIX}", prefix || process.env.PREFIX));

            return message.author
                .send(data, { split: true })
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

        data.push(language.cmdName.replace("${command.name}", command.name));

        if (command.aliases) data.push(language.cmdAliases.replace("${command.aliases.join(', ')}", command.aliases.join(', ')));
        if (command.description) data.push(language.cmdDescription.replace("${command.description}", language[command.name]));
        if (command.usage) data.push(language.cmdUsage.replace("${prefix}", prefix).replace("${command.name}", command.name).replace("${command.usage}", command.usage));

        data.push(language.cmdCooldown.replace("${command.cooldown || 3}", command.cooldown || 3));

        message.channel.send(data, { split: true });
    },
};
