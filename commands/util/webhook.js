module.exports = {
    name: "webhook",
    aliases: ["w"],
    description: {"en_US" : "Create a webhook.", "zh_CN" : "把自己变成机器人说话"},
    execute(message, args) {
        message.channel
            .createWebhook(message.author.username, {
                name: message.author.username,
                avatar: message.author.avatarURL(),
            })
            .then((hook) => hook.send(args.join(" ")));
        message.delete();
    },
};
