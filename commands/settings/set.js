const { error, success } = require('../../functions/Util.js');
const fs = require('fs');
const { GuildChannel } = require('discord.js');

async function setLanguage(command, args, language) {
    if (!args.length > 0) return error(command, language.noArgs);
    if (args[0] !== 'en_US' && args[0] !== 'zh_CN' && args[0] !== 'zh_TW') return error(command, language.languageNotSupported);

    const collection = command.client.guildOptions;
    if (collection) {
        const guildOption = await collection.findOne({ id: command.guild.id }) ?? { id: command.guild.id, options: {} };
        guildOption.options['language'] = args[0];

        const query = { id: command.guild.id };
        const options = { upsert: true };
        await collection.replaceOne(query, guildOption, options);
        return success(command, language.changeSuccess.replace('${args[0]}', args[0]));
    } else {
        const rawData = fs.readFileSync('./data/guildOption.json', 'utf-8');
        const guildCollection = JSON.parse(rawData);
        const guildOption = guildCollection[command.guild.id] ?? { id: command.guild.id, options: {} };
        guildOption.options['language'] = args[0];
        guildCollection[command.guild.id] = guildOption;

        fs.writeFileSync('./data/guildOption.json', JSON.stringify(guildCollection));
        return success(command, language.changeSuccess.replace('${args[0]}', args[0]));
    }
}

async function setChannel(command, args, language) {
    if (!args.length > 0) return error(command, language.noArgs);
    if (!(args[0] instanceof GuildChannel)) return error(command, language.argsNotChannel);

    const collection = command.client.guildOptions;
    if (collection) {
        const guildOption = await collection.findOne({ id: command.guild.id }) ?? { id: command.guild.id, options: {} };
        guildOption.options['channel'] = args[0].id;

        const query = { id: command.guild.id };
        const options = { upsert: true };
        await collection.replaceOne(query, guildOption, options);
        return success(command, language.channelChanged.replace('${args[0]}', args[0]));
    } else {
        const rawData = fs.readFileSync('./data/guildOption.json', 'utf-8');
        const guildCollection = JSON.parse(rawData);
        const guildOption = guildCollection[command.guild.id] ?? { id: command.guild.id, options: {} };
        guildOption.options['channel'] = args[0].id;
        guildCollection[command.guild.id] = guildOption;

        fs.writeFileSync('./data/guildOption.json', JSON.stringify(guildCollection));
        return success(command, language.channelChanged.replace('${args[0]}', args[0]));
    }
}
module.exports = {
    name: 'set',
    guildOnly: true,
    description: {
        'en_US': 'Adjust my settings in this server',
        'zh_CN': '调整我的伺服器设定',
        'zh_TW': '调整我的伺服器設定',
    },
    subcommands: [
        {
            name: 'language',
            description: {
                'en_US': 'Set the language I use',
                'zh_CN': '设定我使用的语言',
                'zh_TW': '設定我使用的語言',
            },
            options: [
                {
                    name: 'language',
                    description: {
                        'en_US': 'Set the language I use',
                        'zh_CN': '设定我使用的语言',
                        'zh_TW': '設定我使用的語言',
                    },
                    type: 'STRING',
                    choices: [['en_US', 'en_US'], ['zh_CN', 'zh_CN'], ['zh_TW', 'zh_TW']],
                    required: true,
                },
            ],
        },
        {
            name: 'logger_channel',
            description: {
                'en_US': 'Channel for me to log server events in!',
                'zh_CN': '让我记录群內事件的频道',
                'zh_TW': '讓我記錄群內事件的頻道',
            },
            options: [
                {
                    name: 'channel',
                    description: {
                        'en_US': 'Logger channel',
                        'zh_CN': '纪录频道',
                        'zh_TW': '記錄頻道',
                    },
                    type: 'CHANNEL',
                    required: true,
                },
            ],
        },
    ],
    async execute(message, args, language) {
        await setLanguage(message, args, language);
    },
    slashCommand: {
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
