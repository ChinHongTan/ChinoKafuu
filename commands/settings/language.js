module.exports = {
    name: 'language',
    guildOnly: true,
    description: true,
    async execute(message, args, language) {
        const collection = message.client.guildOptions;

        if (!args.length > 0) return message.channel.send(language.noArgs);
        if (args[0] !== 'en_US' && args[0] !== 'zh_CN' && args[0] !== 'zh_TW') return message.channel.send(language.languageNotSupported);

        const guildOption = {
            id: message.guild.id,
            options: { language: args[0] },
        };

        const query = { id: message.guild.id };
        const options = { upsert: true };
        const replacement = guildOption;
        collection.replaceOne(query, replacement, options);
        return message.channel.send(language.changeSuccess.replace('${args[0]}', args[0]));
    },
};
