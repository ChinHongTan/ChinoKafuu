const { error, success } = require('../../functions/Util.js');
const { GuildChannel, Role } = require('discord.js');
const { saveGuildData } = require('../../functions/Util');

async function changeSettings(guildId, client, category, target) {
    console.log(category, target);
    const guildData = client.guildCollection.get(guildId);
    guildData.data[category] = target;
    console.log(guildData);
    client.guildCollection.set(guildId, guildData);
    await saveGuildData(client, guildId);
}

async function setLanguage(command, args, language) {
    if (args.length < 1) return error(command, language.noArgs);
    if (args[0] !== 'en_US' && args[0] !== 'zh_CN' && args[0] !== 'zh_TW') return error(command, language.languageNotSupported);

    await changeSettings(command.guild.id, command.client, 'language', args[0]);
    language = command.client.language[args[0]]['set'];
    await success(command, language.changeSuccess.replace('${args[0]}', args[0]));
}

async function setLogChannel(command, args, language) {
    if (args.length < 1) return error(command, language.noArgs);
    if (!(args[0] instanceof GuildChannel)) return error(command, language.argsNotChannel);

    await changeSettings(command.guild.id, command.client, 'channel', args[0].id);
    return success(command, language.channelChanged.replace('${args[0]}', args[0]));
}

async function setStarboardChannel(command, args, language) {
    if (args.length < 1) return error(command, language.noArgs);
    if (!(args[0] instanceof GuildChannel)) return error(command, language.argsNotChannel);

    await changeSettings(command.guild.id, command.client, 'starboard', args[0].id);
    return success(command, language.channelChanged.replace('${args[0]}', args[0]));
}

async function addLevelReward(command, args, language) {
    if (args.length < 1) return error(command, language.noArgs);
    if (isNaN(args[0])) return error(command, language.argsNotNumber);
    if (!(args[1] instanceof Role) || !args[1]) return error(command, language.noRole);

    const rewards = command.client.guildCollection.get(command.guild.id).data.levelReward ?? {};
    rewards[args[0]] = args[1].id;
    console.log(rewards);
    await changeSettings(command.guild.id, command.client, 'levelReward', rewards);
    return success(command, language.levelRewardAdded.replace('${args[0]}', args[0]).replace('${args[1]}', args[1]));
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
        {
            name: 'starboard',
            description: {
                'en_US': 'Set starboard channel!',
                'zh_CN': '设置名句精华频道',
                'zh_TW': '設置名句精華頻道',
            },
            options: [
                {
                    name: 'channel',
                    description: {
                        'en_US': 'Starboard channel',
                        'zh_CN': '名句精华频道',
                        'zh_TW': '名句精華頻道',
                    },
                    type: 'CHANNEL',
                    required: true,
                },
            ],
        },
        {
            name: 'add_level_reward',
            description: {
                'en_US': 'Set reward given when a user levels up.',
                'zh_CN': '设置用户升级时给予的奖励',
                'zh_TW': '設置用戶升級時給予的獎勵',
            },
            options: [
                {
                    name: 'level',
                    description: {
                        'en_US': 'Level',
                        'zh_CN': '等级',
                        'zh_TW': '等級',
                    },
                    type: 'INTEGER',
                    required: true,
                    min: 0,
                },
                {
                    name: 'role',
                    description: {
                        'en_US': 'Role to give',
                        'zh_CN': '给予的身份组',
                        'zh_TW': '給予的身份組',
                    },
                    type: 'ROLE',
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
            return await setLogChannel(message, [message.mentions.channels.first()], language);
        case 'starboard':
            return await setStarboardChannel(message, [message.mentions.channels.first()], language);
        case 'add_level_reward':
            return await addLevelReward(message, [args[1], message.mentions.roles.first()], language);
        }
    },
    slashCommand: {
        async execute(interaction, language) {
            switch (interaction.options.getSubcommand()) {
            case 'language':
                return await setLanguage(interaction, [interaction.options.getString('language')], language);
            case 'logger_channel':
                return await setLogChannel(interaction, [interaction.options.getChannel('channel')], language);
            case 'starboard':
                return await setStarboardChannel(interaction, [interaction.options.getChannel('starboard')], language);
            case 'add_level_reward':
                return await addLevelReward(interaction, [interaction.options.getInteger('level'), interaction.options.getRole('role')], language);
            }
        },
    },
};
