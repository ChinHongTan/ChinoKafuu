const { SlashCommandBuilder } = require('@discordjs/builders');
const { reply } = require('../../functions/commandReply.js');
const fs = require('fs');

async function setLanguage(command, args, language) {
    if (!args.length > 0) return reply(command, language.noArgs, 'RED');
    if (args[0] !== 'en_US' && args[0] !== 'zh_CN' && args[0] !== 'zh_TW') return reply(command, language.languageNotSupported, 'RED');

    const collection = command.client.guildOptions;
    if (collection) {
        const guildOption = await collection.findOne({ id: command.guild.id }) ?? { id: command.guild.id, options: {} };
        guildOption.options['language'] = args[0];

        const query = { id: command.guild.id };
        const options = { upsert: true };
        await collection.replaceOne(query, guildOption, options);
        return reply(command, language.changeSuccess.replace('${args[0]}', args[0]), 'GREEN');
    } else {
        const rawData = fs.readFileSync('./data/guildOption.json');
        const guildCollection = JSON.parse(rawData);
        const guildOption = guildCollection[command.guild.id] ?? { id: command.guild.id, options: {} };
        guildOption.options['language'] = args[0];
        guildCollection[command.guild.id] = guildOption;

        fs.writeFileSync('./data/guildOption.json', JSON.stringify(guildCollection));
        return reply(command, language.changeSuccess.replace('${args[0]}', args[0]), 'GREEN');
    }
}
module.exports = {
    name: 'language',
    guildOnly: true,
    description: true,
    async execute(message, args, language) {
        await setLanguage(message, args, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder()
            .addStringOption((option) =>
                option.setName('language')
                    .setDescription('language to use')
                    .setRequired(true)
                    .addChoice('en_US', 'en_US')
                    .addChoice('zh_TW', 'zh_TW')
                    .addChoice('zh_CN', 'zh_CN')),
        async execute(interaction, language) {
            await setLanguage(interaction, [interaction.options.getString('language')], language);
        },
    },
};
