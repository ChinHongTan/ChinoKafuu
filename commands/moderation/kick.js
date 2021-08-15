module.exports = {
    name: "kick",
    description: "Kick someone out.",
    guildOnly: true,
    usage: "[mention]",
    permissions: "ADMINISTRATOR",
    async execute(message) {
        if (!message.mentions.users.size) return message.reply("You need to tag a user in order to kick them!");
        const taggedUser = message.mentions.members.first();
        if (!taggedUser) return message.channel.send(":x: | **User Is Not In The Guild!");
        if (taggedUser.id === message.author.id) return message.channel.send("You Cannot Kick Yourself!");
        if (!taggedUser.kickable) return message.channel.send("Cannot Kick This User!");
        await taggedUser.kick();
        message.channel.send(`Successfully Kicked: ${taggedUser.user.username}!`);
    },
};
