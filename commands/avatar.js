module.exports = {
	name: "avatar",
	cooldown: 10,
	aliases: ["icon", "pfp"],
	guildOnly: true,
	description: "Send the url of an avatar.",
	async execute(client, message, args) {
		const Discord = require('discord.js')
		const fuzzysort = require("fuzzysort");
		let keyword = message.content.substr(
			message.content.indexOf(" ") + 1
		);
		let arr = message.guild.members.cache.map(member => {
			let memberInfo = {};
			memberInfo.nickname = member.nickname;
			memberInfo.username = member.user.username;
			memberInfo.tag = member.user.tag;
			memberInfo.discriminator = member.user.discriminator;
			memberInfo.id = member.id;
			return memberInfo;
		});
		let result = fuzzysort.go(keyword, arr, {
			keys: ['nickname', 'username', 'tag', 'discriminator'],
			limit: 1
		})
		let target
		if (args[0]) {
			try {
				target = message.mentions.users.first() || client.users.resolve(result[0]?.obj.id) || await client.users.resolve(args[0]) || await client.users.fetch(args[0])
			} catch (error) {
				if (error.message.endsWith('is not snowflake.')) {} else {
					console.log(error)
				}
			}
			if (!target) {
				target = message.author
			}
		} else {
			target = message.author
		}
		if (!target) return message.channel.send(`Can't find a member matching \`${keyword}\`!`)
		var embed = new Discord.MessageEmbed()
			.setAuthor(`__Avatar__`, message.author.displayAvatarURL())
			.setTitle(`${target.username}#${target.username.discriminator || target.discriminator} 的頭貼`)
			.setImage(target.displayAvatarURL({
				size: 4096,
				dynamic: true
			}))
			.setColor("RANDOM")
			.setTimestamp(Date.now())
		message.channel.send(embed)
	},
};