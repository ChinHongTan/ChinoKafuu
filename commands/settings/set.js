const { error, success } = require('../../functions/Util.js');
const { GuildChannel } = require('discord.js');
const { saveGuildData } = require('../../functions/Util');

async function changeSettings(guildId, client, category, target) {
    const guildData = client.guildCollection.get(guildId);
    guildData.data[category] = target;
    client.guildCollection.set(guildId, guildData);
    await saveGuildData(client, guildId);
}

async function setLanguage(command, args, language) {
    if (!args.length > 0) return error(command, language.noArgs);
    if (args[0] !== 'en_US' && args[0] !== 'zh_CN' && args[0] !== 'zh_TW') return error(command, language.languageNotSupported);

    await changeSettings(command.guild.id, command.client, 'language', args[0]);
    language = command.client.language[args[0]]['set'];
    await success(command, language.changeSuccess.replace('${args[0]}', args[0]));
}

async function setChannel(command, args, language) {
    if (!args.length > 0) return error(command, language.noArgs);
    if (!(args[0] instanceof GuildChannel)) return error(command, language.argsNotChannel);

    await changeSettings(command.guild.id, command.client, 'channel', args[0].id);
    return success(command, language.channelChanged.replace('${args[0]}', args[0]));
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
            name: 'log_channel',
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
        switch (args[0]) {
        case 'language':
            return await setLanguage(message, [args[1]], language);
        case 'logger_channel':
            return await setChannel(message, [message.mentions.channels.first()], language);
        }
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
