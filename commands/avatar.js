module.exports = {
    name: "avatar",
    cooldown: 10,
    aliases: ["icon", "pfp"],
    description: "Send the url of an avatar.",
    execute(message, args) {
        const Discord = require("discord.js");
        if (!args) {
            const embed = new Discord.MessageEmbed()
                .setTitle("__Your avatar__")
                .setColor("RANDOM")
                .setImage(
                    `${message.author.displayAvatarURL({
                        format: "png",
                        dynamic: true,
                        size: 2048,
                    })}`
                );
            return message.channel.send(embed);
        }
        if (message.mentions.users.size) {
            const avatarList = message.mentions.users.map((user) => {
                const embed = new Discord.MessageEmbed()
                    .setTitle(`__${user.username}'s avatar__`)
                    .setColor("RANDOM")
                    .setImage(
                        `${user.displayAvatarURL({
                            format: "png",
                            dynamic: true,
                            size: 2048,
                        })}`
                    );
                return embed;
            });

            // send the entire array of strings as a message
            // by default, discord.js will `.join()` the array with `\n`
            avatarList.forEach((embed) => {
                message.channel.send(embed);
            });
        }

        const avatarArray = [];
        for (let id in args) {
            let user = message.client.user.cache.find((user) => user.id === id);
            if (user) {
                return avatarArray.push(user);
            }
            user = message.client.user.cache.find(
                (user) => user.displayName === id
            );
            if (user) {
                return avatarArray.push(user);
            }
            user = message.client.user.cache.find((user) => user.tag === id);
            if (user) {
                return avatarArray.push(user);
            }
        }
        const avatarList = avatarArray.map((user) => {
            const embed = new Discord.MessageEmbed()
                .setTitle(`__${user.username}'s avatar__`)
                .setColor("RANDOM")
                .setImage(
                    `${user.displayAvatarURL({
                        format: "png",
                        dynamic: true,
                        size: 2048,
                    })}`
                );
            return embed;
        });

        avatarList.forEach((embed) => {
            message.channel.send(embed);
        });
    },
};
