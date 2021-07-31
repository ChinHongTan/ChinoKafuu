module.exports = {
    name: "avatar",
    cooldown: 10,
    aliases: ["icon", "pfp", "av"],
    guildOnly: true,
    description: "Send the url of an avatar.",
    execute(message, args) {
        const Discord = require("discord.js");
        const FuzzySort = require("../../functions/fuzzysort.js");
        const fuzzysort = new FuzzySort(message);
        if (args.length < 1) {
            // display author's avatar
            const embed = new Discord.MessageEmbed()
                .setTitle("__Your avatar__")
                .setColor("RANDOM")
                .setImage(`${message.author.displayAvatarURL({
                        format: "png",
                        dynamic: true,
                        size: 2048,
                    })}`
                );
            return message.channel.send(embed);
        }
        if (message.mentions.users.size) {
            // display all user's avatars mentioned by the author
            const avatarList = message.mentions.users.map((user) => {
                const embed = new Discord.MessageEmbed()
                    .setTitle(`__${user.username}'s avatar__`)
                    .setColor("RANDOM")
                    .setImage(`${user.displayAvatarURL({
                            format: "png",
                            dynamic: true,
                            size: 2048,
                        })}`
                    );
                return embed;
            });

            // send the entire array of embed to the channel
            avatarList.forEach((embed) => {
                message.channel.send(embed);
            });
        }
        // check if an id is provided
        let user = message.guild.members.cache.find((member) => member.user.id === args[0]);
        // if id exists
        if (user) {
            const embed = new Discord.MessageEmbed()
                .setTitle(`__${user.displayName}'s avatar__`)
                .setColor(user.displayHexColor)
                .setImage(
                    `${user.user.displayAvatarURL({
                        format: "png",
                        dynamic: true,
                        size: 2048,
                    })}`
                );
            return message.channel.send(embed);
        }

        // perform a fuzzy search based on the keyword given
        let keyword = message.content.substr(message.content.indexOf(" ") + 1);
        let member = fuzzysort.search(keyword);
        if (!member) {
            return message.channel.send(`Can't find a member matching \`${keyword}\`!`);
        }

        const embed = new Discord.MessageEmbed()
            .setTitle(`__${member.displayName}'s avatar__`)
            .setColor(member.displayHexColor)
            .setImage(`${member.user.displayAvatarURL({
                    format: "png",
                    dynamic: true,
                    size: 2048,
                })}`
            );
        message.channel.send(embed);
    },
};
