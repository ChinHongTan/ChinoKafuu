module.exports = {
	name: "message",
	async execute(message, client) {
        const { currency } = client;
        const { getEditDistance } = require("../functions/eventFunctions");
        const prefix = process.env.PREFIX || require("../config/config.json").prefix;
        const Discord = require("discord.js");

        if (message.author.bot) {return;}
        currency.add(message.author.id, 1);
        if (!message.content.startsWith(prefix)) {return;}
    
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
    
        const command =
            client.commands.get(commandName) ||
            client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
    
        if (!command) {
            let keys = Array.from(client.commands.keys());
            let distances = new Map();
            for (let cmd of keys) {
                distances.set(cmd, getEditDistance(commandName, cmd));
            }
            let recommendation = new Map([...distances].filter(([k, v]) => v <= 2).sort((a, b) => a[1] - b[1]));
            if (recommendation.size > 0) {
                message.channel.send(`\`${prefix}${commandName}\` is not a valid command! Do you mean: `);
                recommendation.forEach((_similarity, cmd) => {
                    message.channel.send(`\`${prefix}${cmd}\`\n`);
                });
            } else {
                message.channel.send(`\`${prefix}${commandName}\` is not a valid command!`);
            }
    
            return;
        }
    
        if (command.permissions) {
            const authorPerms = message.channel.permissionsFor(message.author);
            if (!authorPerms || !authorPerms.has(command.permissions)) {
                return message.reply("You can not do this!");
            }
        }
    
        if (command.args && !args.length) {
            let reply = `You didn't provide any arguments, ${message.author}!`;
    
            if (command.usage) {
                reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
            }
    
            return message.channel.send(reply);
        }
    
        if (command.guildOnly && message.channel.type === "dm") {
            return message.reply("I can't execute that command inside DMs!");
        }
    
        const { cooldowns } = client;
    
        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection());
        }
    
        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 3) * 1000;
    
        if (timestamps.has(message.author.id)) {
            const expirationTime =
                timestamps.get(message.author.id) + cooldownAmount;
    
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
            }
    
            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        }
    
        try {
            await command.execute(message, args);
        } catch (error) {
            console.error(error);
            message.reply("There was an error trying to execute that command!");
            message.channel.send(error.message);
        }
        return;
	},
};