const fs = require("fs");
const Discord = require("discord.js");
const prefix = process.env.PREFIX || require("./config/config.json").prefix;
const token = process.env.TOKEN || require("./config/config.json").token;

const currency = new Discord.Collection();
const { Users } = require("./data/dbObjects");

const client = new Discord.Client();

client.commands = new Discord.Collection();
let functions = {};

const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}

client.cooldowns = new Discord.Collection();

const functionFiles = fs
    .readdirSync("./functions")
    .filter((file) => file.endsWith(".js"));

for (const file of functionFiles) {
    const func = require(`./functions/${file}`);

    functions[func.name] = func.func;
}

Reflect.defineProperty(currency, "add", {
    /* eslint-disable-next-line func-name-matching */
    value: async function add(id, amount) {
        const user = currency.get(id);
        if (user) {
            user.balance += Number(amount);
            return user.save();
        }
        const newUser = await Users.create({ user_id: id, balance: amount });
        currency.set(id, newUser);
        return newUser;
    },
});

Reflect.defineProperty(currency, "getBalance", {
    /* eslint-disable-next-line func-name-matching */
    value: function getBalance(id) {
        const user = currency.get(id);
        return user ? user.balance : 0;
    },
});
client.once("ready", async () => {
    const storedBalances = await Users.findAll();
    storedBalances.forEach((b) => currency.set(b.user_id, b));
    console.log("Ready!");
    client.user.setPresence({
        activity: { name: "c!help", type: "LISTENING" },
        status: "dnd",
    });
});

client.on("messageDelete", (message) => {
    functions.storeSnipes(message);
});

client.on("messageUpdate", (oldMessage, newMessage) => {
    functions.storeEditSnipes(oldMessage, newMessage);
});

client.on("voiceStateUpdate", (oldState, newState) => {
    functions.dynamic(oldState, newState);
});

client.on("guildMemberAdd", async (member) => {
    functions.sendWelcomeMessage(member);
});

client.on("message", async (message) => {
    if (message.author.bot) return;
    currency.add(message.author.id, 1);
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command =
        client.commands.get(commandName) ||
        client.commands.find(
            (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
        );

    if (!command) {
        let keys = Array.from(client.commands.keys());
        let distances = new Map();
        for (cmd of keys) {
            distances.set(cmd, functions.getEditDistance(commandName, cmd));
        }
        let recommendation = new Map([...distances].filter(([k, v]) => v <= 2).sort((a, b) => a[1] - b[1]));
        if (recommendation.size > 2) {
            message.channel.send(
                `\`${prefix}${commandName}\` is not a valid command! Do you mean: `
            );
            recommendation.forEach((similarity, cmd) => {
                message.channel.send(`\`${prefix}${cmd}\`\n`);
            });
        } else {
            message.channel.send(`\`${prefix}${commandName}\` is not a valid command!`)
        }

        return;
    }

    if (command.permissions) {
		const authorPerms = message.channel.permissionsFor(message.author);
		if (!authorPerms || !authorPerms.has(command.permissions)) {
			return message.reply('You can not do this!');
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
            return message.reply(
                `please wait ${timeLeft.toFixed(
                    1
                )} more second(s) before reusing the \`${
                    command.name
                }\` command.`
            );
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
});
/*
client.on("message", async (message) => {
    if (message.author.bot) return;
    if (message.channel.id === "803270261604352040") {
        functions.count(message);
    }

    if (!message.content.startsWith(prefix)) return;
    },
);
*/

client.login(token);
