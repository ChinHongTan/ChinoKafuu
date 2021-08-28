const fs = require('fs');
const Discord = require('discord.js');
const token = process.env.TOKEN || require('./config/config.json').token;

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
    const snipeCollection = db.collection('snipes');
    client.snipeCollection = snipeCollection;
    const editSnipeCollection = db.collection('editsnipes');
    client.editSnipeCollection = editSnipeCollection;
    const guildOptions = db.collection('guildoptions');
    client.guildOptions = guildOptions;
})();

const client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MEMBERS,
        Discord.Intents.FLAGS.GUILD_BANS,
        Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
        Discord.Intents.FLAGS.GUILD_WEBHOOKS,
        Discord.Intents.FLAGS.GUILD_INVITES,
        Discord.Intents.FLAGS.GUILD_VOICE_STATES,
        Discord.Intents.FLAGS.GUILD_PRESENCES,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Discord.Intents.FLAGS.DIRECT_MESSAGES,
        Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING,
    ],
});
const en_US = require('./language/en_US.json');
const zh_CN = require('./language/zh_CN.json');
const zh_TW = require('./language/zh_TW.json');

client.commands = new Discord.Collection();
client.language = { en_US, zh_CN, zh_TW };

const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter((file) => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.name, command);
    }
}

client.cooldowns = new Discord.Collection();

const eventFiles = fs.readdirSync('./events').filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, async (...args) => await event.execute(...args, client));
    }
    else {
        client.on(event.name, async (...args) => await event.execute(...args, client));
    }
}

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
