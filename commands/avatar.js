module.exports = {
    name: "avatar",
    cooldown: 10,
    aliases: ["icon", "pfp"],
    description: "Send the url of an avatar.",
    execute(message) {
        const Discord = require("discord.js");
        if (!message.mentions.users.size) {
            const embed = new Discord.MessageEmbed()
                .setTitle("__Your avatar__")
                .setColor("RANDOM")
                .setImage(
                    `${message.author.displayAvatarURL({
                        format: "png",
                        dynamic: true,
                        size: 1024
                    })}`
                );
            return message.channel.send(embed);
        }

        const avatarList = message.mentions.users.map((user) => {
            const embed = new Discord.MessageEmbed()
                .setTitle(`__${user.username}'s avatar__`)
                .setColor("RANDOM")
                .setImage(
                    `${user.displayAvatarURL({ format: "png", dynamic: true, size: 1024 })}`
                );
            return embed;
        });

        // send the entire array of strings as a message
        // by default, discord.js will `.join()` the array with `\n`
        avatarList.forEach (embed => {
            message.channel.send(embed);
        })
    },
};
