const fs = require("fs");
const Discord = require("discord.js");
const { prefix, token } = require("./config.json");
const ytdl = require("discord-ytdl-core");
const ytsr = require("ytsr");
const Canvas = require("canvas");

const currency = new Discord.Collection();
const { Users } = require("./dbObjects");
const snipes = require("./snipes.js");
const editSnipes = require("./editSnipes.js");
const counts = require("./counts.js");
const queue = new Map();

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

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
    snipes.storeSnipes(message);
});

client.on("messageUpdate", (oldMessage, newMessage) => {
    editSnipes.storeEditSnipes(oldMessage, newMessage);
});

client.on("voiceStateUpdate", (oldState, newState) => {
    if (newState.member.user.bot) return;
    let mainChannel = oldState.guild.channels.cache.find(
        (channel) => channel.id === "860456123953840128"
    );
    if (mainChannel) {
        let channels = mainChannel.parent.children;
        channels.each((channel) => {
            if (channel.id === "860456123953840128") return;
            if (channel.members.size < 1) {
                channel.delete();
            }
        });
    }
    if (newState.channelID === "860456123953840128") {
        newState.guild.channels
            .create(`${newState.member.displayName}的頻道`, {
                type: "voice",
                bitrate: 256000,
                userLimit: 99,
                parent: newState.guild.channels.cache.find(
                    (channel) => channel.id === "860456123953840128"
                ).parent,
            })
            .then((voiceChannel) => {
                newState.member.voice.setChannel(voiceChannel);
            });
    }
});

const applyText = (canvas, text) => {
    const context = canvas.getContext("2d");
    let fontSize = 70;

    do {
        context.font = `${(fontSize -= 10)}px sans-serif`;
    } while (context.measureText(text).width > canvas.width - 300);

    return context.font;
};

client.on("guildMemberAdd", async (member) => {
    const channel = member.guild.channels.cache.find(
        (ch) => ch.name === "閒聊-chat"
    );
    if (!channel) return;

    const canvas = Canvas.createCanvas(700, 250);
    const context = canvas.getContext("2d");

    const background = await Canvas.loadImage("./wallpaper.jpg");
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    context.strokeStyle = "#74037b";
    context.strokeRect(0, 0, canvas.width, canvas.height);

    context.font = "28px sans-serif";
    context.fillStyle = "#ffffff";
    context.fillText(
        "Welcome to the server,",
        canvas.width / 2.5,
        canvas.height / 3.5
    );

    context.font = applyText(canvas, `${member.displayName}!`);
    context.fillStyle = "#ffffff";
    context.fillText(
        `${member.displayName}!`,
        canvas.width / 2.5,
        canvas.height / 1.8
    );

    context.font = applyText(canvas, `${member.displayName}!`);
    context.fillStyle = "#ffffff";
    context.fillText(
        `bruuuuuuuuuuuuuuuuuh`,
        canvas.width / 2.5,
        canvas.height / 0.8
    );

    context.beginPath();
    context.arc(125, 125, 100, 0, Math.PI * 2, true);
    context.closePath();
    context.clip();

    const avatar = await Canvas.loadImage(
        member.user.displayAvatarURL({ format: "jpg" })
    );
    context.drawImage(avatar, 25, 25, 200, 200);

    const attachment = new Discord.MessageAttachment(
        canvas.toBuffer(),
        "welcome-image.png"
    );

    channel.send(`Welcome to the server, ${member}!`, attachment);
});

client.on("message", (message) => {
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
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply("there was an error trying to execute that command!");
    }
    return;
});

client.on("message", async (message) => {
    if (message.author.bot) return;
    if (message.channel.id === "803270261604352040") {
        counts.count(message);
    }

    if (!message.content.startsWith(prefix)) return;

    const serverQueue = queue.get(message.guild.id);

    if (message.content.startsWith(`${prefix}play`)) {
        if (message.channel.type === "dm")
            return message.channel.send(
                "I can't execute that command inside DMs!"
            );
        execute(message, serverQueue);
        return;
    } else if (message.content.startsWith(`${prefix}skip`)) {
        if (message.channel.type === "dm")
            return message.channel.send(
                "I can't execute that command inside DMs!"
            );
        skip(message, serverQueue);
        return;
    } else if (message.content.startsWith(`${prefix}stop`)) {
        if (message.channel.type === "dm")
            return message.channel.send(
                "I can't execute that command inside DMs!"
            );
        stop(message, serverQueue);
        return;
    } else if (message.content.startsWith(`${prefix}queue`)) {
        if (message.channel.type === "dm")
            return message.channel.send(
                "I can't execute that command inside DMs!"
            );
        if (serverQueue) {
            var songQueue = serverQueue.songs.slice(1);
            var printQueue = "";
            songQueue.forEach((item, index) => {
                var songNo = index + 1;
                var songTitle = item.title;
                var songURL = item.url;
                var songLength = item.length;
                var queueString = `${songNo}.[${songTitle}](${songURL}) | ${format(
                    songLength
                )}\n\n`;
                printQueue += queueString;
            });
            let embed = new Discord.MessageEmbed()
                .setColor("#ff0000")
                .setTitle("Song Queue")
                .setDescription(
                    `**Now playing**\n[${serverQueue.songs[0].title}](${serverQueue.songs[0].url})\n\n**Queued Songs**\n${printQueue}${serverQueue.songs.length} songs in queue`
                );
            return message.channel.send(embed);
        } else return message.channel.send("There is no song in the queue!");
    } else if (
        message.content.startsWith(`${prefix}remove`) ||
        message.content.startsWith(`${prefix}r`)
    ) {
        if (message.channel.type === "dm")
            return message.channel.send(
                "I can't execute that command inside DMs!"
            );
        if (serverQueue) {
            const args = message.content.split(" ");
            args.shift();
            args.forEach((number) => {
                queuenum = Number(number);
                if (
                    Number.isInteger(queuenum) &&
                    queuenum <= serverQueue.songs.length &&
                    queuenum > 0
                ) {
                    serverQueue.songs.splice(queuenum, 1);
                } else {
                    message.channel.send("You have to enter a valid integer!");
                }
            });
        }
    } else if (message.content.startsWith(`${prefix}search`)) {
        if (message.channel.type === "dm")
            return message.channel.send(
                "I can't execute that command inside DMs!"
            );
        var keyword = message.content.substr(message.content.indexOf(" ") + 1);
        message.channel.send(`Searching ${keyword}...`);
        const filters1 = await ytsr.getFilters(keyword);
        const filter1 = filters1.get("Type").get("Video");
        const searchResults = await ytsr(filter1.url, {
            gl: "TW",
            hl: "zh-Hant",
            limit: 10,
        });
        var item = searchResults.items;
        var page = 0;
        if (item.length < 1)
            return message.channel.send(`No video was found for ${keyword}!`);
        var embed = createEmbed(item, page);

        message.channel.send(embed).then((embedMessage) => {
            embedMessage
                .react("⬅️")
                .then(embedMessage.react("➡️"))
                .then(embedMessage.react("▶️"));
            const filter = (reaction, user) =>
                ["⬅️", "➡️", "▶️"].includes(reaction.emoji.name) && !user.bot;
            const collector = embedMessage.createReactionCollector(filter, {
                idle: 12000,
                dispose: true,
            });
            collector.on("collect", (r) => {
                if (r.emoji.name === "⬅️") {
                    page -= 1;
                    if (page < 0) page = item.length - 1;
                    var editedEmbed = createEmbed(item, page);
                    embedMessage.edit(editedEmbed);
                } else if (r.emoji.name === "➡️") {
                    page += 1;
                    if (page + 1 > item.length) page = 0;
                    var editedEmbed = createEmbed(item, page);
                    embedMessage.edit(editedEmbed);
                } else if (r.emoji.name === "▶️") {
                    collector.stop();
                    message.content = `c!play ${item[page].url}`;
                    execute(message, serverQueue);
                    embedMessage.delete();
                }
            });
            collector.on("remove", (r) => {
                if (r.emoji.name === "⬅️") {
                    page -= 1;
                    if (page < 0) page = item.length - 1;
                    var editedEmbed = createEmbed(item, page);
                    embedMessage.edit(editedEmbed);
                } else if (r.emoji.name === "➡️") {
                    page += 1;
                    if (page + 1 > item.length) page = 0;
                    var editedEmbed = createEmbed(item, page);
                    embedMessage.edit(editedEmbed);
                }
            });
        });
    }
});

async function execute(message, serverQueue) {
    const args = message.content.split(" ");

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
        return message.channel.send(
            "You need to be in a voice channel to play music!"
        );
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send(
            "I need the permissions to join and speak in your voice channel!"
        );
    }

    if (ytdl.validateURL(args[1])) {
        var link = args[1];
    } else {
        var keyword = message.content.substr(message.content.indexOf(" ") + 1);
        message.channel.send(`Searching ${keyword}...`);
        const filters1 = await ytsr.getFilters(keyword);
        const filter1 = filters1.get("Type").get("Video");
        const searchResults = await ytsr(filter1.url, {
            gl: "TW",
            hl: "zh-Hant",
            limit: 1,
        });
        var link = searchResults.items[0].url;
    }
    const songInfo = await ytdl.getInfo(link);
    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
        length: songInfo.videoDetails.lengthSeconds,
    };

    if (!serverQueue) {
        const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true,
        };

        queue.set(message.guild.id, queueContruct);

        queueContruct.songs.push(song);

        try {
            var connection = await voiceChannel.join();
            queueContruct.connection = connection;
            play(message.guild, queueContruct.songs[0]);
        } catch (err) {
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err);
        }
    } else {
        serverQueue.songs.push(song);
        return message.channel.send(
            `${song.title} has been added to the queue!`
        );
    }
}

function skip(message, serverQueue) {
    if (!message.member.voice.channel)
        return message.channel.send(
            "You have to be in a voice channel to stop the music!"
        );
    if (!serverQueue)
        return message.channel.send("There is no song that I could skip!");
    serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
    if (!message.member.voice.channel)
        return message.channel.send(
            "You have to be in a voice channel to stop the music!"
        );

    if (!serverQueue)
        return message.channel.send("There is no song that I could stop!");

    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    const dispatcher = serverQueue.connection
        .play(
            ytdl(song.url, { quality: "highestaudio", highWaterMark: 1 << 25 })
        )
        .on("finish", () => {
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
        .on("error", (error) => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}

function format(duration) {
    // Hours, minutes and seconds
    var hrs = ~~(duration / 3600);
    var mins = ~~((duration % 3600) / 60);
    var secs = ~~duration % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}

function createEmbed(item, page) {
    let embed = new Discord.MessageEmbed()
        .setURL(item[page].url)
        .setTitle(item[page].title)
        .setDescription(item[page].description)
        .setColor("#ff0000")
        .setImage(item[page].bestThumbnail.url)
        .addField("Views", item[page].views)
        .addField("Duration", item[page].duration)
        .addField("Uploaded at", item[page].uploadedAt)
        .setFooter(
            `${item[page].author.name}\nPage${page + 1}/${item.length}`,
            item[page].author.bestAvatar.url
        );
    return embed;
}
client.login(token);
