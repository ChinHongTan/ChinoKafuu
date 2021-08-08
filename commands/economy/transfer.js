module.exports = {
    name: "transfer",
    cooldown: 10,
    aliases: ["pay"],
    description: {"en_US" : "Transfer money to a user", "zh_CN" : "给其他人送钱"},
    async execute(message, args, language) {
        const { currency } = message.client;

        const currentAmount = currency.getBalance(message.author.id);
        const transferAmount = args[0];
        const transferTarget = message.mentions.users.first();

        if (!transferAmount || isNaN(transferAmount)) {
            return message.channel.send(language.invalidAmount.replace("${message.author}", message.author));
        }
        if (!transferTarget) return message.channel.send(language.noTransferTarget);
        if (transferAmount > currentAmount) {
            return message.channel.send(language.noMoneyTransfer.replace("${message.author}", message.author).replace("${currentAmount}", currentAmount));
        }
        if (transferAmount <= 0) {
            return message.channel.send(language.negativeAmount.replace("${message.author}", message.author));
        }

        currency.add(message.author.id, -transferAmount);
        currency.add(transferTarget.id, transferAmount);

        return message.channel.send(language.transferSuccess.replace("${transferAmount}", transferAmount).replace("${transferTarget.tag}", transferTarget.tag).replace("${currency.getBalance(message.author.id)}", currency.getBalance(message.author.id)));
    },
};
