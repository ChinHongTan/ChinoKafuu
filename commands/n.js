<<<<<<< HEAD
module.exports = {
    name: 'n',
    cooldown: 3,
	description: 'Try it!',
	execute(message, args) {
        if (args.length < 1) {
            return message.channel.send('You need to provide a 6 digit number!');
        } else {
            return message.channel.send(`https://nhentai.net/g/${args[0]}/`);
        }
	},
};
=======
module.exports = {
    name: 'n',
    cooldown: 3,
	description: 'Try it!',
	execute(message, args) {
        if (args.length < 1) {
            return message.channel.send('You need to provide a 6 digit number!');
        } else {
            return message.channel.send(`https://nhentai.net/g/${args[0]}/`);
        }
	},
};
>>>>>>> cbde5418c9694fd6f96015a1a518fdeff848bf7a
