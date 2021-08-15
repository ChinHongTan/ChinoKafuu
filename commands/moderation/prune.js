module.exports = {
    name: "prune",
    aliases: ["cut", "delete", "del"],
    guildOnly: true,
    description: {"en_US" : "Delete messages.", "zh_CN" : "删除讯息"},
    execute(message, args, language) {
        const amount = parseInt(args[0]) + 1;

        if (isNaN(amount)) {
            return message.reply(language.invalidNum);
        } else if (amount <= 2 || amount > 100) {
            return message.reply(language.notInRange);
        }

        message.channel.bulkDelete(amount, true).catch((err) => {
            console.error(err);
            message.channel.send(language.pruneError);
        });
    },
};
