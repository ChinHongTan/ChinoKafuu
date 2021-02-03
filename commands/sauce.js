<<<<<<< HEAD
module.exports = {
	name: 'sauce',
	description: 'Search SauceNao for an image source.',
	cooldown: 5,
	execute(message, args) {
		const Discord = require('discord.js');
		const sagiri = require('sagiri');
		let mySauce = sagiri('340f20a8a7eeb9d0506c8c07e20621c382c66ae9');

		function createEmbed (response, page) {
			var sourceURL = response[page].url;
			var info = '';
			for (const [key, value] of Object.entries(response[page].raw.data)) {
				if (key === 'ext_urls') continue;
				info += `\`${key} : ${value}\`\n`;
			};
			let embed = new Discord.MessageEmbed()
			.setTitle(response[page].site)
			.setDescription(`Similarity: ${response[page].similarity}%`)
			.setColor('#008000')
			.setImage(response[page].thumbnail)
			.addFields(
				{name: '**Source URL**', value: sourceURL},
				{name: 'Additional info', value: info},
			)
			.setFooter(`page ${page + 1}/${response.length}`)
			return embed;
		};

		function searchForImage(searchImage) {
			mySauce(searchImage, { results: 10})
			.then(response => {
				console.log('request sucessful');
				if (response.length < 1) return message.channel.send("No image was found!");
				var page = 0;
				let embed = createEmbed(response, page);
				message.channel.send(embed).then(embedMessage => {
					embedMessage.react('⬅️')
					.then(embedMessage.react('➡️'));
					const filter = (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && !user.bot;
					const collector = embedMessage.createReactionCollector(filter, { idle: 60000, dispose: true });
					collector.on('collect', r => {
						if (r.emoji.name === '⬅️') {
							page -= 1;
							if (page < 0) page = response.length - 1;
							var editedEmbed = createEmbed(response, page);
							embedMessage.edit(editedEmbed);
						} else if (r.emoji.name === '➡️') {
							page += 1;
							if (page + 1 > response.length) page = 0;
							var editedEmbed = createEmbed(response, page);
							embedMessage.edit(editedEmbed);
						};
					});
					collector.on('remove', r => {
						if (r.emoji.name === '⬅️') {
							page -= 1;
							if (page < 0) page = response.length - 1;
							var editedEmbed = createEmbed(response, page);
							embedMessage.edit(editedEmbed);
						} else if (r.emoji.name === '➡️') {
							page += 1;
							if (page + 1 > response.length) page = 0;
							var editedEmbed = createEmbed(response, page);
							embedMessage.edit(editedEmbed);
						};
					});
				});
			})
			.catch(error => {
				console.error(error);
			});
		}

		var searchImage = '';

		if (args.length < 1) {
			message.channel.messages.fetch({ limit: 25 })
			.then(messages => {
				for (const msg of messages.values()) {
					if (msg.attachments.size > 0) {
						searchImage = msg.attachments.first().proxyURL;
						break;
					};
				};
				if (!searchImage) return message.channel.send("You have to upload an image before using this command!");
				searchForImage(searchImage);
			});
		} else {
			searchImage = args[0];
			searchForImage(searchImage);
		};
	},
=======
module.exports = {
	name: 'sauce',
	description: 'Search SauceNao for an image source.',
	cooldown: 5,
	execute(message, args) {
		const Discord = require('discord.js');
		const sagiri = require('sagiri');
		let mySauce = sagiri('340f20a8a7eeb9d0506c8c07e20621c382c66ae9');

		function createEmbed (response, page) {
			var sourceURL = response[page].url;
			var info = '';
			for (const [key, value] of Object.entries(response[page].raw.data)) {
				if (key === 'ext_urls') continue;
				info += `\`${key} : ${value}\`\n`;
			};
			let embed = new Discord.MessageEmbed()
			.setTitle(response[page].site)
			.setDescription(`Similarity: ${response[page].similarity}%`)
			.setColor('#008000')
			.setImage(response[page].thumbnail)
			.addFields(
				{name: '**Source URL**', value: sourceURL},
				{name: 'Additional info', value: info},
			)
			.setFooter(`page ${page + 1}/${response.length}`)
			return embed;
		};

		function searchForImage(searchImage) {
			mySauce(searchImage, { results: 10})
			.then(response => {
				console.log('request sucessful');
				if (response.length < 1) return message.channel.send("No image was found!");
				var page = 0;
				let embed = createEmbed(response, page);
				message.channel.send(embed).then(embedMessage => {
					embedMessage.react('⬅️')
					.then(embedMessage.react('➡️'));
					const filter = (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && !user.bot;
					const collector = embedMessage.createReactionCollector(filter, { idle: 60000, dispose: true });
					collector.on('collect', r => {
						if (r.emoji.name === '⬅️') {
							page -= 1;
							if (page < 0) page = response.length - 1;
							var editedEmbed = createEmbed(response, page);
							embedMessage.edit(editedEmbed);
						} else if (r.emoji.name === '➡️') {
							page += 1;
							if (page + 1 > response.length) page = 0;
							var editedEmbed = createEmbed(response, page);
							embedMessage.edit(editedEmbed);
						};
					});
					collector.on('remove', r => {
						if (r.emoji.name === '⬅️') {
							page -= 1;
							if (page < 0) page = response.length - 1;
							var editedEmbed = createEmbed(response, page);
							embedMessage.edit(editedEmbed);
						} else if (r.emoji.name === '➡️') {
							page += 1;
							if (page + 1 > response.length) page = 0;
							var editedEmbed = createEmbed(response, page);
							embedMessage.edit(editedEmbed);
						};
					});
				});
			})
			.catch(error => {
				console.error(error);
			});
		}

		var searchImage = '';

		if (args.length < 1) {
			message.channel.messages.fetch({ limit: 25 })
			.then(messages => {
				for (const msg of messages.values()) {
					if (msg.attachments.size > 0) {
						searchImage = msg.attachments.first().proxyURL;
						break;
					};
				};
				if (!searchImage) return message.channel.send("You have to upload an image before using this command!");
				searchForImage(searchImage);
			});
		} else {
			searchImage = args[0];
			searchForImage(searchImage);
		};
	},
>>>>>>> cbde5418c9694fd6f96015a1a518fdeff848bf7a
};