const { error, success } = require('../../functions/Util.js');
const { Role, TextChannel } = require('discord.js');
const { saveGuildData } = require('../../functions/Util');
const { SlashCommandBuilder } = require('@discordjs/builders');

async function changeSettings(guildId, client, category, target) {
    const guildData = client.guildCollection.get(guildId);
    guildData.data[category] = target;
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

async function setChannel(command, args, language, target) {
    if (args.length < 1) return error(command, language.noArgs);
    if (!(args[0] instanceof TextChannel)) return error(command, language.argsNotChannel);
    await changeSettings(command.guild.id, command.client, target, args[0].id);
    if (target === 'starboard') return success(command, language.logChannelChanged.replace('${args[0]}', args[0]));
    if (target === 'channel') return success(command, language.starboardChanged.replace('${args[0]}', args[0]));
}

async function addLevelReward(command, args, language) {
    if (args.length < 1) return error(command, language.noArgs);
    if (isNaN(args[0])) return error(command, language.argsNotNumber);
    if (!(args[1] instanceof Role) || !args[1]) return error(command, language.noRole);

    const rewards = command.client.guildCollection.get(command.guild.id).data.levelReward ?? {};
    rewards[args[0]] = args[1].id;
    await changeSettings(command.guild.id, command.client, 'levelReward', rewards);
    return success(command, language.levelRewardAdded.replace('${args[0]}', args[0]).replace('${args[1]}', args[1]));
}

async function removeLevelReward(command, args, language) {
    if (args.length < 1) return error(command, language.noArgs);
    if (!(args[0] instanceof Role)) return error(command, language.noRole);

    const rewards = command.client.guildCollection.get(command.guild.id).data.levelReward;
    if (!rewards) return error(command, '你還沒有設置等級獎勵！');
    for (const r in rewards) {
        if (rewards[r] === args[1].id) {
            delete rewards[r];
        }
    }
    await changeSettings(command.guild.id, command.client, 'levelReward', rewards);
    return success(command, language.levelRewardRemoved.replace('${args[0]}', args[0]).replace('${args[1]}', args[1]));
}

module.exports = {
    name: 'set',
    guildOnly: true,
    description: {
        'en_US': 'Adjust my settings in this server',
        'zh_CN': '调整我的伺服器设定',
        'zh_TW': '调整我的伺服器設定',
    },
    data: new SlashCommandBuilder()
        .setName('set')
        .setDescriptionLocalizations({
            'en_US': 'Adjust my settings in this server',
            'zh_CN': '调整我的伺服器设定',
            'zh_TW': '调整我的伺服器設定',
        })
        .addSubcommand((subcommand) => subcommand
            .setName('language')
            .setDescriptionLocalizations({
                'en_US': 'Set the language I use',
                'zh_CN': '设定我使用的语言',
                'zh_TW': '設定我使用的語言',
            })
            .addStringOption((option) => option
                .setName('language')
                .setDescriptionLocalizations({
                    'en_US': 'Set the language I use',
                    'zh_CN': '设定我使用的语言',
                    'zh_TW': '設定我使用的語言',
                })
                .addChoices([['en_US', 'en_US'], ['zh_CN', 'zh_CN'], ['zh_TW', 'zh_TW']])
                .setRequired(true),
            ),
        )
        .addSubcommand((subcommand) => subcommand
            .setName('log_channel')
            .setDescriptionLocalizations({
                'en_US': 'Channel for me to log server events in!',
                'zh_CN': '让我记录群內事件的频道',
                'zh_TW': '讓我記錄群內事件的頻道',
            })
            .addChannelOption((option) => option
                .setName('channel')
                .setDescriptionLocalizations({
                    'en_US': 'Channel for me to log server events in!',
                    'zh_CN': '让我记录群內事件的频道',
                    'zh_TW': '讓我記錄群內事件的頻道',
                })
                .setRequired(true),
            ),
        )
        .addSubcommand((subcommand) => subcommand
            .setName('starboard')
            .setDescriptionLocalizations({
                'en_US': 'Set starboard channel!',
                'zh_CN': '设置名句精华频道',
                'zh_TW': '設置名句精華頻道',
            })
            .addChannelOption((option) => option
                .setName('channel')
                .setDescriptionLocalizations({
                    'en_US': 'Starboard channel',
                    'zh_CN': '名句精华频道',
                    'zh_TW': '名句精華頻道',
                })
                .setRequired(true),
            ),
        )
        .addSubcommand((subcommand) => subcommand
            .setName('add_level_reward')
            .setDescriptionLocalizations({
                'en_US': 'Set reward given when a user levels up.',
                'zh_CN': '设置用户升级时给予的奖励',
                'zh_TW': '設置用戶升級時給予的獎勵',
            })
            .addIntegerOption((option) => option
                .setName('level')
                .setDescriptionLocalizations({
                    'en_US': 'Level',
                    'zh_CN': '等级',
                    'zh_TW': '等級',
                })
                .setRequired(true),
            )
            .addRoleOption((option) => option
                .setName('role')
                .setDescriptionLocalizations({
                    'en_US': 'Role to give',
                    'zh_CN': '给予的身份组',
                    'zh_TW': '給予的身份組',
                })
                .setRequired(true),
            ),
        )
        .addSubcommand((subcommand) => subcommand
            .setName('remove_level_reward')
            .setDescriptionLocalizations({
                'en_US': 'Remove reward role',
                'zh_CN': '移除奖励身份组',
                'zh_TW': '移除獎勵身份組',
            })
            .addRoleOption((option) => option
                .setName('channel')
                .setDescriptionLocalizations({
                    'en_US': 'Role to remove',
                    'zh_CN': '要删除的身份组',
                    'zh_TW': '要刪除的身份組',
                })
                .setRequired(true),
            ),
        ),
    async execute(interaction, language) {
        switch (interaction.options.getSubcommand()) {
        case 'language':
            return await setLanguage(interaction, [interaction.options.getString('language')], language);
        case 'log_channel':
            return await setChannel(interaction, [interaction.options.getChannel('channel')], language, 'channel');
        case 'starboard':
            return await setChannel(interaction, [interaction.options.getChannel('channel')], language, 'starboard');
        case 'add_level_reward':
            return await addLevelReward(interaction, [interaction.options.getInteger('level'), interaction.options.getRole('role')], language);
        case 'remove_level_reward':
            return await removeLevelReward(interaction, [interaction.options.getRole('role')], language);
        }
    },
};
