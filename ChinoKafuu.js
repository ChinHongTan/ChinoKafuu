const fs = require("fs");
const Discord = require("discord.js");
const token = process.env.TOKEN || require("./config/config.json").token;

const { MongoClient } = require('mongodb');
const mongodb = process.env.MONGODB_URI || require('./config/config.json').mongodb;
const mongoClient = new MongoClient(mongodb);

// Database Name
const dbName = 'projectSekai';

// Use connect method to connect to the server
(async () => {
    await mongoClient.connect();
    console.log('Connected successfully to server');
    const db = mongoClient.db(dbName);
    const collection = db.collection('documents');
    client.collection = collection;
})();

const { Users } = require("./data/dbObjects");

const client = new Discord.Client();
client.currency = new Discord.Collection();
require("discord-buttons")(client);
const { currency } = client;

client.commands = new Discord.Collection();

const commandFolders = fs.readdirSync("./commands");

for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith(".js"));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}

client.cooldowns = new Discord.Collection();

const eventFiles = fs.readdirSync("./events").filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, async (...args) => await event.execute(...args, client));
	} else {
		client.on(event.name, async (...args) => await event.execute(...args, client));
	}
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