const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const ytdl = require("discord-ytdl-core");
const ytsr = require('ytsr');
const Canvas = require('canvas');
const bot = require('discord-rich-presence')('781328218753859635');

const currency = new Discord.Collection();
const { Users } = require('./dbObjects');
let rawData = fs.readFileSync('./editSnipes.json');
let data = fs.readFileSync('./snipes.json');
let snipeWithGuild = new Map(JSON.parse(data));
let editSnipesWithGuild = new Map(JSON.parse(rawData));
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

Reflect.defineProperty(currency, 'add', {
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

Reflect.defineProperty(currency, 'getBalance', {
	/* eslint-disable-next-line func-name-matching */
	value: function getBalance(id) {
		const user = currency.get(id);
		return user ? user.balance : 0;
	},
});
client.once('ready', async () => {
  const storedBalances = await Users.findAll();
  storedBalances.forEach(b => currency.set(b.user_id, b));
  console.log('Ready!');
  //client.user.setPresence({ activity: { name: 'c!help', type: 'LISTENING'}, status: 'dnd' });
  bot.updatePresence({
    state: 'slithering',
    details: '🐍',
    startTimestamp: Date.now(),
    endTimestamp: Date.now() + 1337,
    largeImageKey: 'p1',
    smallImageKey: 'p2',
    instance: true,
  });
});

client.on('messageDelete', message => {
	if (message.author.bot) return;
	if (!message.guild) return;

	var snipe = new Object();
  var content = message.content;
  if (!content) content = 'None';
  if (snipeWithGuild.has(message.guild.id)) {
    snipes = snipeWithGuild.get(message.guild.id);
  } else {
    var snipes = [];
  }

	snipe.author = message.author.tag;
	snipe.authorAvatar = message.author.displayAvatarURL({ format: "png", dynamic: true });
	snipe.content = message.content;
	snipe.timestamp = message.createdAt.toUTCString([8]);

	if (message.attachments.size > 0 && message.guild.id === '764839074228994069') {
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
		snipes.unshift(snipe);
		if (snipes.length > 10) snipes.pop();
    snipeWithGuild.set(message.guild.id, snipes);
    let data = JSON.stringify(Array.from(snipeWithGuild.entries()), null, 2);
    fs.writeFileSync(`./snipes.json`, data);
	} else {
		snipes.unshift(snipe);
		if (snipes.length > 10) snipes.pop();
    snipeWithGuild.set(message.guild.id, snipes);
		let data = JSON.stringify(Array.from(snipeWithGuild.entries()), null, 2);
    fs.writeFileSync(`./snipes.json`, data);
	};
});

client.on('messageUpdate', (oldMessage, newMessage) => {
	if (oldMessage.author.bot) return;
	if (!oldMessage.guild) return;

	var editSnipe = new Object();
  if (editSnipesWithGuild.has(oldMessage.guild.id)) {
    editSnipes = editSnipesWithGuild.get(oldMessage.guild.id);
  } else {
    var editSnipes = [];
  }

	editSnipe.author = newMessage.author.tag;
	editSnipe.authorAvatar = newMessage.author.displayAvatarURL({ format: "png", dynamic: true});
	editSnipe.content = oldMessage.content;
  if (newMessage.editedAt) editSnipe.timestamp = newMessage.editedAt.toUTCString([8]);
	editSnipes.unshift(editSnipe);
	if (editSnipes.length > 10) editSnipes.pop();
  editSnipesWithGuild.set(oldMessage.guild.id, editSnipes);
	let data = JSON.stringify(Array.from(editSnipesWithGuild.entries()), null, 2);
	fs.writeFileSync(`./editSnipes.json`, data);
});

const applyText = (canvas, text) => {
	const context = canvas.getContext('2d');
	let fontSize = 70;

	do {
		context.font = `${fontSize -= 10}px sans-serif`;
	} while (context.measureText(text).width > canvas.width - 300);

	return context.font;
};

client.on('guildMemberAdd', async member => {
	const channel = member.guild.channels.cache.find(ch => ch.name === '閒聊-chat');
	if (!channel) return;

	const canvas = Canvas.createCanvas(700, 250);
	const context = canvas.getContext('2d');

	const background = await Canvas.loadImage('./wallpaper.jpg');
	context.drawImage(background, 0, 0, canvas.width, canvas.height);

	context.strokeStyle = '#74037b';
	context.strokeRect(0, 0, canvas.width, canvas.height);

	context.font = '28px sans-serif';
	context.fillStyle = '#ffffff';
	context.fillText('Welcome to the server,', canvas.width / 2.5, canvas.height / 3.5);

	context.font = applyText(canvas, `${member.displayName}!`);
	context.fillStyle = '#ffffff';
	context.fillText(`${member.displayName}!`, canvas.width / 2.5, canvas.height / 1.8);

  context.font = applyText(canvas, `${member.displayName}!`);
	context.fillStyle = '#ffffff';
  context.fillText(`bruuuuuuuuuuuuuuuuuh`, canvas.width / 2.5, canvas.height / 0.8);

	context.beginPath();
	context.arc(125, 125, 100, 0, Math.PI * 2, true);
	context.closePath();
	context.clip();

	const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
	context.drawImage(avatar, 25, 25, 200, 200);

	const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

	channel.send(`Welcome to the server, ${member}!`, attachment);
});

/*

// Pass the entire Canvas object because you'll need access to its width and context
const applyText = (canvas, text) => {
	const context = canvas.getContext('2d');

	// Declare a base size of the font
	let fontSize = 70;

	do {
		// Assign the font to the context and decrement it so it can be measured again
		context.font = `${fontSize -= 10}px sans-serif`;
		// Compare pixel width of the text to the canvas minus the approximate avatar size
	} while (context.measureText(text).width > canvas.width - 300);

	// Return the result to use in the actual canvas
	return context.font;
};

client.on('guildMemberAdd', async member => {
	const channel = member.guild.channels.cache.find(ch => ch.name === '閒聊-chat');
	if (!channel) return;

	// Create a 700x250 pixels canvas and get its context
	// The context will be used to modify the canvas
	const canvas = Canvas.createCanvas(700, 250);
	const context = canvas.getContext('2d');

  // Since the image takes time to load, you should await it
	const background = await Canvas.loadImage('./wallpaper.jpg');
	// This uses the canvas dimensions to stretch the image onto the entire canvas
	context.drawImage(background, 0, 0, canvas.width, canvas.height);

  // Set the color of the stroke
	context.strokeStyle = '#74037b';
	// Draw a rectangle with the dimensions of the entire canvas
	context.strokeRect(0, 0, canvas.width, canvas.height);

  // Slightly smaller text placed above the member's display name
	context.font = '28px sans-serif';
	context.fillStyle = '#ffffff';
	context.fillText('Welcome to the server,', canvas.width / 2.5, canvas.height / 3.5);

	// Add an exclamation point here and below
	context.font = applyText(canvas, `${member.displayName}!`);
	context.fillStyle = '#ffffff';
	context.fillText(`${member.displayName}!`, canvas.width / 2.5, canvas.height / 1.8);

  // Assign the decided font to the canvas
	context.font = applyText(canvas, member.displayName);
	context.fillStyle = '#ffffff';
	context.fillText(member.displayName, canvas.width / 2.5, canvas.height / 1.8);

  // Select the font size and type from one of the natively available fonts
	context.font = '60px sans-serif';
	// Select the style that will be used to fill the text in
	context.fillStyle = '#ffffff';
	// Actually fill the text with a solid color
	context.fillText(member.displayName, canvas.width / 2.5, canvas.height / 1.8);

  // Pick up the pen
	context.beginPath();
	// Start the arc to form a circle
	context.arc(125, 125, 100, 0, Math.PI * 2, true);
	// Put the pen down
	context.closePath();
	// Clip off the region you drew on
	context.clip();

  // Wait for Canvas to load the image
	const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
  // Move the image downwards vertically and constrain its height to 200, so that it's square
	context.drawImage(avatar, 25, 25, 200, 200);
	// Draw a shape onto the main canvas
	context.drawImage(avatar, 25, 0, 200, canvas.height);

	// Use the helpful Attachment class structure to process the file for you
	const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

	channel.send(`Welcome to the server, ${member}!`, attachment);
});

*/

client.on('message', message => {
	if (message.author.bot) return;
  currency.add(message.author.id, 1);
  if (!message.content.startsWith(prefix)) return;

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
  if (message.channel.id === '779192010418421762') {
    if (message.attachments.size > 0) {
      message.attachments.each(attachment => {
        let embed = new Discord.MessageEmbed()
          .setColor('#000fff')
          .setDescription(message.content)
          .setImage(attachment.proxyURL);
        message.channel.send(embed);
      });
      message.delete();
    } else {
      let embed = new Discord.MessageEmbed()
        .setColor('#000fff')
        .setDescription(message.content);
      message.channel.send(embed);
      message.delete();
    };
  } else if (message.channel.id === '803270261604352040') {
    let rawData = fs.readFileSync('./countingData.json');
    let countingData = JSON.parse(rawData);
    if (!Number(message.content)) return;
    if (countingData.counter == '0' || !countingData.counter) {
      if (message.content != '1') return;
      countingData.author = message.author.tag;
      countingData.counter = message.content;
      let data = JSON.stringify(countingData, null, 2);
      fs.writeFileSync('./countingData.json', data);
      return message.react('✅');
    };
    if (message.author.tag != countingData.author) {
      if (message.content != Number(countingData.counter) + 1) {
        countingData.counter = '0';
        countingData.author = '';
        let data = JSON.stringify(countingData, null, 2);
        fs.writeFileSync('./countingData.json', data);
        return message.react('❌');
      } else {
        countingData.counter = message.content;
        countingData.author = message.author.tag;
        let data = JSON.stringify(countingData, null, 2);
        fs.writeFileSync('./countingData.json', data);
        return message.react('✅');
      };
    };
  };

  if (!message.content.startsWith(prefix)) return;

  const serverQueue = queue.get(message.guild.id);

  if (message.content.startsWith(`${prefix}play`)) {
    if (message.channel.type === 'dm') return message.channel.send("I can't execute that command inside DMs!");
    execute(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}skip`)) {
    if (message.channel.type === 'dm') return message.channel.send("I can't execute that command inside DMs!");
    skip(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}stop`)) {
    if (message.channel.type === 'dm') return message.channel.send("I can't execute that command inside DMs!");
    stop(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}queue`)) {
    if (message.channel.type === 'dm') return message.channel.send("I can't execute that command inside DMs!");
    if (serverQueue) {
      var songQueue = serverQueue.songs.slice(1);
      var printQueue = '';
      songQueue.forEach((item, index) => {
        var songNo = index + 1;
        var songTitle = item.title;
        var songURL = item.url;
        var songLength = item.length;
        var queueString = `${songNo}.[${songTitle}](${songURL}) | ${format(songLength)}\n\n`;
        printQueue += queueString;
      });
      let embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setTitle('Song Queue')
        .setDescription(`**Now playing**\n[${serverQueue.songs[0].title}](${serverQueue.songs[0].url})\n\n**Queued Songs**\n${printQueue}${serverQueue.songs.length} songs in queue`);
      return message.channel.send(embed);
    } else return message.channel.send("There is no song in the queue!");
  } else if (message.content.startsWith(`${prefix}remove`) || message.content.startsWith(`${prefix}r`)) {
    if (message.channel.type === 'dm') return message.channel.send("I can't execute that command inside DMs!");
    if (serverQueue) {
      const args = message.content.split(' ');
      args.shift();
      args.forEach(number => {
        queuenum = Number(number);
        if (Number.isInteger(queuenum) && queuenum <= serverQueue.songs.length && queuenum > 0) {
          serverQueue.songs.splice(queuenum, 1);
        } else {
          message.channel.send("You have to enter a valid integer!");
        }
      });
    };
  } else if (message.content.startsWith(`${prefix}search`)) {
      if (message.channel.type === 'dm') return message.channel.send("I can't execute that command inside DMs!");
      var keyword = message.content.substr(message.content.indexOf(' ') + 1);
      message.channel.send(`Searching ${keyword}...`);
      const filters1 = await ytsr.getFilters(keyword);
      const filter1 = filters1.get('Type').get('Video');
      const searchResults = await ytsr(filter1.url, {gl: 'TW', hl: 'zh-Hant', limit: 10});
      var item = searchResults.items;
      var page = 0;
      if (item.length < 1) return message.channel.send(`No video was found for ${keyword}!`);
      var embed = createEmbed(item, page);

      message.channel.send(embed).then(embedMessage => {
          embedMessage.react('⬅️')
          .then(embedMessage.react('➡️'))
          .then(embedMessage.react('▶️'));
          const filter = (reaction, user) => ['⬅️', '➡️', '▶️'].includes(reaction.emoji.name) && !user.bot;
          const collector = embedMessage.createReactionCollector(filter, { idle: 12000, dispose: true });
          collector.on('collect', r => {
              if (r.emoji.name === '⬅️') {
                page -= 1;
                if (page < 0) page = item.length - 1;
                var editedEmbed = createEmbed(item, page);
                embedMessage.edit(editedEmbed);
              } else if (r.emoji.name === '➡️') {
                page += 1;
                if (page + 1 > item.length) page = 0;
                var editedEmbed = createEmbed(item, page);
                embedMessage.edit(editedEmbed);
              } else if (r.emoji.name === '▶️') {
                collector.stop();
                message.content = `c!play ${item[page].url}`;
                execute(message, serverQueue);
                embedMessage.delete();
              }
          });
          collector.on('remove', r => {
              if (r.emoji.name === '⬅️') {
                  page -= 1;
                  if (page < 0) page = item.length - 1;
                  var editedEmbed = createEmbed(item, page);
                  embedMessage.edit(editedEmbed);
              } else if (r.emoji.name === '➡️') {
                  page += 1;
                  if (page + 1 > item.length) page = 0;
                  var editedEmbed = createEmbed(item, page);
                  embedMessage.edit(editedEmbed);
              };
          });
      });
  }});

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
    message.channel.send(`Searching ${keyword}...`);
    const filters1 = await ytsr.getFilters(keyword);
    const filter1 = filters1.get('Type').get('Video');
    const searchResults = await ytsr(filter1.url, {gl: 'TW', hl: 'zh-Hant', limit: 1});
    var link = searchResults.items[0].url;
  };
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
    .play(ytdl(song.url, {quality: 'highestaudio', highWaterMark : 1 << 25,  } ))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Start playing: **${song.title}**`);
};

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
};

function createEmbed(item, page) {
  let embed = new Discord.MessageEmbed()
    .setURL(item[page].url)
    .setTitle(item[page].title)
    .setDescription(item[page].description)
    .setColor('#ff0000')
    .setImage(item[page].bestThumbnail.url)
    .addField('Views', item[page].views)
    .addField('Duration', item[page].duration)
    .addField('Uploaded at', item[page].uploadedAt)
    .setFooter(`${item[page].author.name}\nPage${page + 1}/${item.length}`, item[page].author.bestAvatar.url);
  return embed;
};
client.login(token);