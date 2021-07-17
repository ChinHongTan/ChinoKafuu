module.exports = {
    name: "cemoji",
    cooldown: 3,
    description: "Copy emoji!",
    execute(message, args) {
        const emojiName = message.content.match(/(?<=:.*:).+?(?=>)/g);
        const emojiID = message.content.match(/(?<=<).+?(?=:\d)/g);
        if (!emojiID || !emojiName) {
            return message.channel.send("Please specify an emoji to add!");
        }
        let emojiObj = emojiID.reduce((obj, key, index) => {
            obj[key] = emojiName[index];
            return obj;
        }, {});

        for (let [name, id] of Object.entries(emojiObj)) {
            console.log(name);
            if (name.startsWith('a:')) {
                console.log(`https://cdn.discordapp.com/emojis/${id}.gif?v=1`)
                message.guild.emojis.create(`https://cdn.discordapp.com/emojis/${id}.gif?v=1`, name.substring(2)).then(emoji => {
                    message.channel.send(`The emoji \`${emoji.name}\` ${emoji} was successfully added to the server!`);
                });
            } else {
                console.log(`https://cdn.discordapp.com/emojis/${id}.png?v=1`)
                message.guild.emojis.create(`https://cdn.discordapp.com/emojis/${id}.png?v=1`, name.substring(1)).then(emoji => {
                    message.channel.send(`The emoji \`${emoji.name}\` ${emoji} was successfully added to the server!`);
            });
            }
        }
    },
};
