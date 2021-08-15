module.exports = {
    name: "ban",
    description: "Ban someone.",
    guildOnly: true,
    usage: "[mention]",
    permissions: "ADMINISTRATOR",
    async execute(message) {
        if (!message.mentions.users.size) return message.reply("You need to tag a user in order to ban them!");
        const taggedUser = message.mentions.members.first();
        if (!taggedUser) return message.channel.send(":x: | User Is Not In The Guild!");
        if (taggedUser.id === message.author.id) return message.channel.send("You Cannot Ban Yourself!");
        if (!taggedUser.bannable) return message.channel.send("Cannot Ban This User!");
        await message.guild.members.ban(taggedUser);
        message.channel.send(`Successfully Banned: ${taggedUser.user.username}!`);
    },
};
