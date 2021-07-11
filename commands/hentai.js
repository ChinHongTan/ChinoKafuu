const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
	name: 'hentai',
	cooldown: 3,
	description: 'get a 18r picture',
	execute(client, message) {

		if (!message.channel.nsfw) return message.channel.send("This is not a nsfw channel!");

		let reports = [];

		const nsfw = ['鯊鯊a片.json','18r圖.json','18r圖區.json', 'vtuber18r區域.json'];
		//const sfw = ['vtuber區.json', '蘿莉圖.json', '鯊鯊a片.json'];
		//const loli = ['蘿莉圖.json'];

		let targetFile = nsfw[Math.floor(Math.random() * nsfw.length)];
		let pic = client.pictures[targetFile]
		let images = pic[Math.floor(Math.random() * pic.length)];
		let imageInfo = images.attachments[Math.floor(Math.random() * images.attachments.length)];
		let embed = new Discord.MessageEmbed()
			.setColor('#2d9af8')
			.setTitle(`蘿莉圖！`)
			.setDescription(`來源商：${images.author}\n[圖片鏈接](${images.messageurl})`)
			.setImage(imageInfo.url)
			.setFooter(`蘿莉控的FBI避難所`, 'https://cdn.discordapp.com/icons/764839074228994069/5be3f532073fdae6a9d934e1c6f6a2b5.png?size=2048');
		message.channel.send(embed).then(msg => {
			msg.react('⚠️');
			const filter = (reaction, user) => {
				return ['⚠️'].includes(reaction.emoji.name) && !user.bot;
			};

			msg.awaitReactions(filter, {
					max: 1,
					time: 1000,
					errors: ['time']
				})
				.then(collected => {
					const reaction = collected.first();

					if (reaction.emoji.name === '⚠️') {
						console.log(images.messageurl);
						reports.push(images.messageurl);
						msg.channel.send('图片已举报')
					}
				})
				.catch(err => {
					return err;
				});
		});
		let data = JSON.stringify(reports, null, 2);
		var filename = 'reports.json';
		fs.writeFileSync(`./data/` + filename, data);
	},
};