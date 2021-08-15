module.exports = {
    name: "inventory",
    cooldown: 10,
    aliases: ["inv"],
    description: true,
    async execute(message, _args, language) {
        const { Users } = require("../../data/dbObjects");
        const target = message.mentions.users.first() || message.author;
        const user = await Users.findOne({ where: { user_id: target.id } });
        if (!user) return message.channel.send(language.noInventory.replace("${target.tag}", target.tag));
        const items = await user.getItems();

        if (!items.length) return message.channel.send(language.noInventory.replace("${target.tag}", target.tag));
        return message.channel.send(language.showInventory.replace("${target.tag}", target.tag).replace("${items.map((i) => `${i.amount} ${i.item.name}`).join(', ')}", items.map((i) => `${i.amount} ${i.item.name}`).join(', ')));
    },
};
