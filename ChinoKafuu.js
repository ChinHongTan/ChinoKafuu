const fs = require('fs');
const Discord = require('discord.js');
const token = process.env.TOKEN || require('./config/config.json').token;

const mongodbURI = process.env.MONGODB_URI || require('./config/config.json').mongodb;

const CronJob = require('cron').CronJob;
const pixivRefreshToken = process.env.PIXIV_REFRESH_TOKEN || require('./config/config.json').PixivRefreshToken;
const { updateIllust, sendSuggestedIllust } = require('./functions/Util.js');

const en_US = require('./language/en_US.js');
const zh_CN = require('./language/zh_CN.js');
const zh_TW = require('./language/zh_TW.js');

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
    partials: ['MESSAGE', 'REACTION'],
});

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

client.coolDowns = new Discord.Collection();

const eventFiles = fs.readdirSync('./events').filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, async (...args) => await event.execute(...args, client));
    } else {
        client.on(event.name, async (...args) => await event.execute(...args, client));
    }
}

// if mongodbURI was given
if (mongodbURI) {
    const { MongoClient } = require('mongodb');
    const mongoClient = new MongoClient(mongodbURI);

    // Database Name
    const dbName = 'projectSekai';
    // Use connect method to connect to the server
    (async () => {
        await mongoClient.connect();
        console.log('Connected successfully to server');
        const db = mongoClient.db(dbName);
        client.guildDatabase = db.collection('GuildData');
        await client.login(token);
    })();
} else {
    (async () => {
        await client.login(token);
    })();
}

// update pixiv illust list every day at noon
if (pixivRefreshToken) {
    const job = new CronJob('00 12 * * *', async function() {
        console.log('Updating pixiv illust list...');
        await updateIllust('Chino Kafuu');
        await sendSuggestedIllust(await client.channels.fetch('970590759944335361'));
        console.log('Done!');
    }, null, false, 'Asia/Kuala_Lumpur');
    job.start();
}

// catch errors so that code wouldn't stop
process.on('unhandledRejection', error => {
    console.log(error);
});
