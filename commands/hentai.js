module.exports = {
	name: 'hentai',
	cooldown: 3,
	description: 'get a 18r picture',
	execute(message, args) {
		const fs = require('fs');
		const Discord = require('discord.js');

		if (!message.channel.nsfw) return message.channel.send("This is not a nsfw channel!");

		const imageFiles = fs.readdirSync('./images').filter(file => file.endsWith('.json'));
		var reports = [];
		pictures = new Object();

		for (const filename of imageFiles) {
			let rawdata = fs.readFileSync(`./images/${filename}`);
			let imagefile = JSON.parse(rawdata);

			pictures[filename] = imagefile;
		}

		const nsfw = ['發圖區（18r）.json','vtuber18r區域.json'];
		const sfw = ['vtuber區.json','蘿莉圖.json','鯊鯊a片.json'];
		const loli = ['蘿莉圖.json'];
		var random = Math.floor(Math.random() * nsfw.length);
		var targetFile = nsfw[random];
		var pic = pictures[targetFile];
		var random = Math.floor(Math.random() * pic.length);
		var images = pic[random];
		var messageurl = images.messageurl
		var random = Math.floor(Math.random() * images.attachments.length);
		var imageInfo = images.attachments[random];
		let embed = new Discord.MessageEmbed()
		    .setColor('#2d9af8').setTitle(`蘿莉圖！`).setDescription(`來源商：${images.author}\n[圖片鏈接](${messageurl})`).setImage(imageInfo.url).setFooter(`蘿莉控的FBI避難所`, 'https://cdn.discordapp.com/icons/764839074228994069/5be3f532073fdae6a9d934e1c6f6a2b5.png?size=2048');
		message.channel.send(embed).then(msg => {
			msg.react('⚠️');

			const filter = (reaction, user) => {
				return ['⚠️'].includes(reaction.emoji.name) && !user.bot;
			};

			msg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
				.then(collected => {
					const reaction = collected.first();

					if (reaction.emoji.name === '⚠️') {
						console.log(messageurl);
						reports.push(messageurl);
						msg.channel.send('图片已举报')
					}
				})
				.catch(collected => {
				});
		});
		let data = JSON.stringify(reports, null, 2);
        var filename = 'reports.json';
        fs.writeFileSync(`../data/` + filename, data);
	},
};
