//Dependcies
const fs = require("fs");
const Discord = require("discord.js");
const {
    prefix,
    token,
    SpotifyClientID,
    SpotifyClientSecret
} = require("./config/config.json");
const process = require("process");
const spotify = require('./functions/spotify');
const Bilibili = require('./functions/bilibili')

//initialization
const client = new Discord.Client();
let cooldowns = new Discord.Collection();
client.commands = new Discord.Collection();
client.queue = new Map();
client.spotify = new spotify(SpotifyClientID,SpotifyClientSecret);
client.bilibili = new Bilibili();
let functions = {}

//Database
client.currency = new Discord.Collection();
const {
    Users
} = require("./data/dbObjects");

//Load commands
const commands = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));

for (const file of commands) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command); //Set a new item in the Collection with the key as the command name and the value as the exported module
    console.log(`Loaded command ${file}`);
}
//Load some useful function
const functionFiles = fs
    .readdirSync("./functions")
    .filter((file) => file.endsWith(".js"));

for (const file of functionFiles) {
    const func = require(`./functions/${file}`);
    functions[func.name] = func.func;
    console.log(`Loaded function ${file}`);
}
//Load pictures
const imageFiles = fs.readdirSync('./images').filter(file => file.endsWith('.json'));
client.pictures = new Object();

for (const filename of imageFiles) {
    let rawdata = fs.readFileSync(`./images/${filename}`);
    let imagefile = JSON.parse(rawdata);
    client.pictures[filename] = imagefile;
}

Reflect.defineProperty(client.currency, "add", {
    /* eslint-disable-next-line func-name-matching */
    value: async function add(id, amount) {
        let user = client.currency.get(id);
        if (user) {
            user.balance += Number(amount);
            return await user.save();
        }
        let newUser = await Users.create({
            user_id: id,
            balance: amount
        });
        client.currency.set(id, newUser);
        return newUser;
    },
});

Reflect.defineProperty(client.currency, "getBalance", {
    /* eslint-disable-next-line func-name-matching */
    value: function getBalance(id) {
        let user = client.currency.get(id);
        return user ? user.balance : 0;
    },
});


client.once("ready", async () => {
    console.log("Ready!");
    client.user.setPresence({
        activity: {
            name: "c!help",
            type: "LISTENING"
        },
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
    if (!message.content.startsWith(prefix)) return;

    client.currency.add(message.author.id, 1);

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command =
        client.commands.get(commandName) ||
        client.commands.find(
            (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
        );

    if (!command) return;

    if (command.guildOnly && message.channel.type === "dm") {
        return message.reply("I can't execute that command inside DMs!");
    }

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
                `please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`
            );
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }

    const missingPerm = (member, perms) => {
        const missingPerm = member.permissions.missing(perms)
            .map(str => `\`${str.replace(/_/g, ' ').toLowerCase().replace(/\b(\w)/g, char => char.toUpperCase())}\``)

        return missingPerm.length > 1 ?
            `${missingPerm.slice(0, -1).join(", ")} and ${missingPerm.slice(-1)[0]}` :
            missingPerm[0];
    }

    if (command.userPerms && !message.member.permissions.has(command.userPerms)) return message.reply(`You must have the ${missingPerm(message.member, command.userPerms)} Permissions to use the command`);
    if (command.botPerms && !message.guild.me.permissions.has(command.botPerms)) return message.reply(`Bot missing the following Permissions :${missingPerm(message.guild.me, command.botPerms)} to use the command`);

    try {
        await command.execute(client, message, args);
    } catch (error) {
        console.error(error);
        message.reply("there was an error trying to execute that command!");
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

async function start(){
    console.log('syncing database')
    const storedBalances = await Users.findAll();
    storedBalances.forEach((b) => client.currency.set(b.user_id, b))
    console.log('database synced!')
    client.login(token || process.env.TOKEN);
  }
start()

