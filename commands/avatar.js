module.exports = {
    name: "avatar",
    cooldown: 10,
    aliases: ["icon", "pfp"],
    description: "Send the url of an avatar.",
    execute(message) {
        if (!message.mentions.users.size) {
            const Discord = require("discord.js");
            const embed = new Discord.MessageEmbed()
                .setTitle("__Your avatar__")
                .setColor("RANDOM")
                .setImage(`${message.author.displayAvatarURL({format: "png",dynamic: true})}`)
            return message.channel.send(embed);
        }

        const avatarList = message.mentions.users.map((user) => {
            const embed = new Discord.MessageEmbed()
                .setTitle(`__${user.username} avatar__`)
                .setColor("RANDOM")
                .setImage(`${user.displayAvatarURL({format: "png",dynamic: true})}`)
            return embed;
        });

        // send the entire array of strings as a message
        // by default, discord.js will `.join()` the array with `\n`
        message.channel.send(avatarList);
    },
};
