const { getEditDistance } = require('../functions/Util.js');
const prefix = process.env.PREFIX || require('../config/config.json').prefix;
const owner_id = process.env.OWNERID || require('../config/config.json').owner_id;
const Discord = require('discord.js');
const { addUserExp, getUserData, saveUserData } = require('../functions/Util');

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;

        if (message.guild) {
            const userData = await getUserData(message.client, message.member);
            await saveUserData(client, message.member); // save in collection cache
            if (!('expAddTimestamp' in userData)) {
                await addUserExp(client, message.member);
                setTimeout(() => delete userData['expAddTimestamp'], 1 * 1000);
            }
        }

        if (!message.content.startsWith(prefix)) return;

        // get options
        const guildOption = client.guildCollection.get(message.guild.id);

        const args = message.content.slice(prefix.length).trim().split(/\s+/);
        const commandName = args.shift().toLowerCase();

        // search for command
        const command = client.commands.get(commandName)
            || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

        // suggest a possible command
        if (!command) {
            const keys = Array.from(client.commands.keys());
            const distances = new Map();
            for (const cmd of keys) {
                distances.set(cmd, getEditDistance(commandName, cmd));
            }
            // experiment: use [, v] instead of [k, v]
            const recommendation = new Map([...distances].filter(([, v]) => v <= 2).sort((a, b) => a[1] - b[1]));
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

        if (command.ownerOnly) {
            if (message.author.id !== owner_id) return message.channel.send('This command is only available for the bot owner!');
        }

        if (command.permissions) {
            const authorPerms = message.channel.permissionsFor(message.author);
            if (!authorPerms || !authorPerms.has(command.permissions)) {
                return message.reply(`You cannot do this! Permission needed: ${command.permissions}`);
            }
        }

        if (command.args && !args.length) {
            let reply = `You didn't provide any arguments, ${message.author}!`;

            if (command.usage) {
                reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
            }

            return message.channel.send(reply);
        }

        if (command.guildOnly && message.channel.type === 'dm') {
            return message.reply('I can\'t execute that command inside DMs!');
        }

        // command cool down
        const { coolDowns } = client;

        if (!coolDowns.has(command.name)) {
            coolDowns.set(command.name, new Discord.Collection());
        }

        const now = Date.now();
        const timestamps = coolDowns.get(command.name);
        const coolDownAmount = (command.coolDown || 3) * 1000;

        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + coolDownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), coolDownAmount);

        try {
            // set the default language to English
            const language = client.language[guildOption?.data.language ?? 'en_US'][command.name];
            await command.execute(message, args, language);
        } catch (error) {
            console.error(error);
            message.reply('There was an error trying to execute that command!');
            message.channel.send(error.message);
        }
    },
};
