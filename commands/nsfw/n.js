module.exports = {
    name: "n",
    cooldown: 3,
    description: {"en_US" : "Try it!", "zh_CN" : "试试看!"},
    execute(message, args, language) {
        if (args.length < 1) {
            return message.channel.send(language.noNum);
        } else {
            return message.channel.send(`https://nhentai.net/g/${args[0]}/`);
        }
    },
};
