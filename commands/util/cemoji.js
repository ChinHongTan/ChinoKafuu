module.exports = {
    name: "cemoji",
    cooldown: 3,
    description: {"en_US" : "Copy emoji!", "zh_CN" : "复制表情!"},
    async execute(message, _args, language) {
        const emojiID = message.content.match(/(?<=:.*:).+?(?=>)/g);
        const emojiName = message.content.match(/(?<=<).+?(?=:\d+>)/g);
        if (!emojiID || !emojiName) return message.channel.send(language.noEmoji);
        let emojiObj = emojiName.reduce((obj, key, index) => {
            obj[key] = emojiID[index];
            return obj;
        }, {});

        for (let [name, id] of Object.entries(emojiObj)) {
            console.log(name);
            if (name.startsWith("a:")) {
                let emoji = await message.guild.emojis.create(`https://cdn.discordapp.com/emojis/${id}.gif?v=1`, name.substring(2))
                message.channel.send(language.addSuccess.replace("${emoji.name}", emoji.name).replace("${emoji}", emoji));
            } else {
                let emoji = await message.guild.emojis.create(`https://cdn.discordapp.com/emojis/${id}.png?v=1`, name.substring(1))
                message.channel.send(language.addSuccess.replace("${emoji.name}", emoji.name).replace("${emoji}", emoji));
            }
        }
    },
};
