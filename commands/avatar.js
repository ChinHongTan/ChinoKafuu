module.exports = {
	name: 'avatar',
	cooldown: 10,
	aliases: ['icon', 'pfp'],
	description: 'Send the url of an avatar.',
	execute(message, args) {
	    if (!message.mentions.users.size) {
	    	return message.channel.send(`Your avatar: <${message.author.displayAvatarURL({ format: "png", dynamic: true })}>`);
	    }

	    const avatarList = message.mentions.users.map(user => {
	    	return `${user.username}'s avatar: <${user.displayAvatarURL({ format: "png", dynamic: true })}>`;
	    });

	    // send the entire array of strings as a message
	    // by default, discord.js will `.join()` the array with `\n`
	    message.channel.send(avatarList);
	},
};


//    if (!cooldowns.has(message.author.id)) {
//      	cooldowns.set(message.authur.id, new Discord.Collection());
//  }