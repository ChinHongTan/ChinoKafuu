const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const ytdl = require("ytdl-core");
const ytsr = require('ytsr');

let rawData = fs.readFileSync('./editSnipes.json');
let editSnipes = JSON.parse(rawData);
let data = fs.readFileSync('./snipes.json');
let snipes = JSON.parse(data);
const queue = new Map();

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

client.once("reconnecting", () => {
  console.log("Reconnecting!");
});

client.once("disconnect", () => {
  console.log("Disconnect!");
});

client.once('ready', () => {
	console.log('Ready!');
});

client.on('messageDelete', message => {
	if (message.author.bot) return;
	if (!message.guild) return;

	var snipe = new Object();
    var content = message.content;
    if (!content) content = 'None';

	snipe.author = message.author.tag;
	snipe.authorAvatar = message.author.displayAvatarURL({ format: "png", dynamic: true });
	snipe.content = message.content;
	snipe.timestamp = message.createdAt.toUTCString([8]);

	if (message.attachments.size > 0) {
		const channel = message.client.channels.cache.get('764846009221251122');
		var urlArray = [];
        message.attachments.each(attachment => {
            urlArray.push(attachment.proxyURL);
        });
        snipe.attachments = urlArray
        urlArray.forEach(url => {
			let embed = new Discord.MessageEmbed()
				.setColor('#ffff00')
				.setTitle(`**__Message Delete__**`)
				.addFields(
					{ name: '**User**', value: `${message.author.tag}`, inline: true },
					{ name: '**Channel**', value: `${message.channel}`, inline: true },
					{ name: '**Content**', value: `${content}` },
				)
				.setImage(url);
			channel.send(embed);
		});
		snipes.push(snipe);
		if (snipes.length > 10) snipes.shift();
        let data = JSON.stringify(snipes, null, 2);
        fs.writeFileSync(`./snipes.json`, data);
	} else {
		snipes.push(snipe);
		if (snipes.length > 10) snipes.shift();
		let data = JSON.stringify(snipes, null, 2);
        fs.writeFileSync(`./snipes.json`, data);
	};
});

client.on('messageUpdate', (oldMessage, newMessage) => {
	if (oldMessage.author.bot) return;
	if (!oldMessage.guild) return;

	var editSnipe = new Object();

	editSnipe.author = newMessage.author.tag;
	editSnipe.authorAvatar = newMessage.author.displayAvatarURL({ format: "png", dynamic: true});
	editSnipe.content = oldMessage.content;
  if (newMessage.editedAt) editSnipe.timestamp = newMessage.editedAt.toUTCString([8]);
	editSnipes.push(editSnipe);
	if (editSnipes.length > 10) editSnipes.shift();
	let data = JSON.stringify(editSnipes, null, 2);
	fs.writeFileSync(`./editSnipes.json`, data);
});


client.on('message', message => {
	if (message.author.bot || !message.content.startsWith(prefix)) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.guildOnly && message.channel.type === 'dm') {
	    return message.reply('I can\'t execute that command inside DMs!');
    } 

    if (!cooldowns.has(command.name)) {
	    cooldowns.set(command.name, new Discord.Collection());
    };

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
    	const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

	    if (now < expirationTime) {
		    const timeLeft = (expirationTime - now) / 1000;
		    return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
	    };

	timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    };

	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	};
	return;
});

client.on("message", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const serverQueue = queue.get(message.guild.id);

  if (message.content.startsWith(`${prefix}play`)) {
    execute(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}skip`)) {
    skip(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}stop`)) {
    stop(message, serverQueue);
    return;
  }; 
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
  };

  if (ytdl.validateURL(args[1])) {
    var link = args[1];
  } else {
    var keyword = message.content.substr(message.content.indexOf(' ') + 1);
    message.channel.send(`Searching ${keyword}...`)
    const searchResults = await ytsr(keyword, {gl: 'TW', gl: 'zh', limit: 30});
    var link = searchResults.items[0].url;
  };
  const songInfo = await ytdl.getInfo(link);
  const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
   };

  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
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
    };
  } else {
    serverQueue.songs.push(song);
    return message.channel.send(`${song.title} has been added to the queue!`);
  };
};

function skip(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
  if (!serverQueue)
    return message.channel.send("There is no song that I could skip!");
  serverQueue.connection.dispatcher.end();
};

function stop(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
    
  if (!serverQueue)
    return message.channel.send("There is no song that I could stop!");
    
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
};

function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  };

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url, {quality: 'highestaudio', highWaterMark : 1 << 25 } ))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Start playing: **${song.title}**`);
};

client.login(token);