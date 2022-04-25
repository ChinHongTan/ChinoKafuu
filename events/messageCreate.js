const { getEditDistance } = require('../functions/eventFunctions');
const prefix = process.env.PREFIX || require('../config/config.json').prefix;
const owner_id = process.env.OWNERID || require('../config/config.json').owner_id;
const Discord = require('discord.js');

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        const collection = message.client.guildOptions;
        const rawData = collection ? await collection.findOne({ id: message?.guild?.id }) : undefined;

        // set the default language to English
        const guildOption = rawData ?? {
            id: message?.guild?.id,
            options: { language: 'en_US' },
        };

        if (message.author.bot) return;
        if (!message.content.startsWith(prefix)) return;

        const args = { args: message.content.slice(prefix.length).trim().split(/\s+/) };
        const commandName = args.args.shift().toLowerCase();

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

        if (command.args && !args.args.length) {
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

            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), coolDownAmount);
        }

        try {
            const language = client.language[guildOption.options.language][command.name];
            // language provides the translated string, while guildOption.options.language provides the language
            // the 4th param is not needed in most of the files
            const commandProperties = { name: command.name };
            if (command.subcommandGroups) {
                commandProperties.subCommandGroups = command.subcommandGroups.reduce((previous, current) => {
                    const subCommandGroupProperties = { name: current.name };
                    if (current.subcommands) {
                        subCommandGroupProperties.subCommands = current.subcommands.reduce((pre, cur) => {
                            const subCommandProperties = { name: cur.name };
                            if (cur.options) {
                                subCommandProperties.options = cur.options.reduce((p, c) => {
                                    return [...p, c.name];
                                });
                            }
                            return [...pre, subCommandProperties];
                        });
                    }
                    return [...previous, commandProperties];
                }, []);
            }
            if (command.subcommands) {
                commandProperties.subCommands = command.subcommands.reduce((pre, cur) => {
                    const subCommandProperties = { name: cur.name };
                    if (cur.options) {
                        subCommandProperties.options = cur.options.reduce((p, c) => {
                            return [...p, c.name];
                        });
                    }
                    return [...pre, subCommandProperties];
                });
            }
            if (command.options) {
                commandProperties.options = command.options.reduce((p, c) => {
                    return [...p, c.name];
                });
            }
            args.commandProperties = commandProperties;
            await command.execute(message, args, language, guildOption.options.language);
        } catch (error) {
            console.error(error);
            message.reply('There was an error trying to execute that command!');
            message.channel.send(error.message);
        }
    },
};
