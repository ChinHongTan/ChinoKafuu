module.exports = {
    name: 'n',
    cooldown: 3,
    description: true,
    execute(message, args, language) {
        if (args.length < 1) {
            return message.channel.send(language.noNum);
        }
        return message.channel.send(`https://nhentai.net/g/${args[0]}/`);
    },
};
