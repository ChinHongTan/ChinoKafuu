const { SlashCommandBuilder } = require('@discordjs/builders');
const { reply } = require('../../functions/commandReply.js');
const fs = require('fs');
const { GuildChannel } = require('discord.js');

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
        const rawData = fs.readFileSync('./data/guildOption.json', 'utf-8');
        const guildCollection = JSON.parse(rawData);
        const guildOption = guildCollection[command.guild.id] ?? { id: command.guild.id, options: {} };
        guildOption.options['language'] = args[0];
        guildCollection[command.guild.id] = guildOption;

        fs.writeFileSync('./data/guildOption.json', JSON.stringify(guildCollection));
        return reply(command, language.changeSuccess.replace('${args[0]}', args[0]), 'GREEN');
    }
}

async function setChannel(command, args, language) {
    if (!args.length > 0) return reply(command, language.noArgs, 'RED');
    if (!(args[0] instanceof GuildChannel)) return reply(command, 'Argument not a channel!', 'RED');

    const collection = command.client.guildOptions;
    if (collection) {
        const guildOption = await collection.findOne({ id: command.guild.id }) ?? { id: command.guild.id, options: {} };
        guildOption.options['channel'] = args[0].id;

        const query = { id: command.guild.id };
        const options = { upsert: true };
        await collection.replaceOne(query, guildOption, options);
        return reply(command, `Changed my log channel to ${args[0]}!`, 'GREEN');
    } else {
        const rawData = fs.readFileSync('./data/guildOption.json', 'utf-8');
        const guildCollection = JSON.parse(rawData);
        const guildOption = guildCollection[command.guild.id] ?? { id: command.guild.id, options: {} };
        guildOption.options['channel'] = args[0].id;
        guildCollection[command.guild.id] = guildOption;

        fs.writeFileSync('./data/guildOption.json', JSON.stringify(guildCollection));
        return reply(command, `Changed my log channel to ${args[0]}!`, 'GREEN');
    }
}
module.exports = {
    name: 'set',
    guildOnly: true,
    description: {
        'en_US': 'Set the language used by me in this server.',
        'zh_CN': '设定我在伺服器里使用的语言',
        'zh_TW': '設定我在伺服器裡使用的語言',
    },
    async execute(message, args, language) {
        await setLanguage(message, args, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder()
            .addSubcommand(subcommand =>
                subcommand
                    .setName('language')
                    .setDescription('Language to use by me')
                    .addStringOption((option) =>
                        option.setName('language')
                            .setDescription('language to use')
                            .setRequired(true)
                            .addChoice('en_US', 'en_US')
                            .addChoice('zh_TW', 'zh_TW')
                            .addChoice('zh_CN', 'zh_CN')),
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName('logger_channel')
                    .setDescription('Channel for me to log in!')
                    .addChannelOption((option) =>
                        option.setName('channel')
                            .setDescription('channel')
                            .setRequired(true),
                    ),
            ),
        async execute(interaction, language) {
            switch (interaction.options.getSubcommand()) {
            case 'language':
                return await setLanguage(interaction, [interaction.options.getString('language')], language);
            case 'logger_channel':
                return await setChannel(interaction, [interaction.options.getChannel('channel')], language);
            }
        },
    },
};
