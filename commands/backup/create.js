const { error, success } = require('../../functions/Util.js');
const backup = require('discord-backup');
const prefix = process.env.PREFIX || require('../../config/config.json').prefix;

async function create(command, args, language) {
    const user = command?.user || command?.author;
    const max = args[0] ?? 10;
    backup.setStorageFolder('./my-backups');
    // Check member permissions
    if (!command.member.permissions.has('ADMINISTRATOR')) {
        return error(command, language.notAdmin);
    }
    // Create the backup
    await success(command, language.startBackup.replace('${max}', max));
    const backupData = await backup
        .create(command.guild, {
            maxMessagesPerChannel: max,
            jsonSave: true,
            saveImages: 'base64',
        });
    // And send information to the backup owner
    await user.send({
        embeds: [{
            description: language.doneBackupDM
                .replace('${prefix}', prefix)
                .replace('${backupData.id}', backupData.id),
            color: 'GREEN',
        }],
    });
    await success(command, language.doneBackupGuild);
}

module.exports = {
    name: 'create',
    coolDown: 10,
    aliases: ['backup'],
    guildOnly: true,
    permissions: 'ADMINISTRATOR',
    description: {
        'en_US': 'Create a server backup',
        'zh_CN': '创建一个伺服备份',
        'zh_TW': '創建一個伺服備份',
    },
    options: [
        {
            name: 'max',
            description: {
                'en_US': 'Max messages per channel, default to 10',
                'zh_CN': '频道最大备份讯息量，默认为10',
                'zh_TW': '頻道最大備份訊息量，默認為10',
            },
            type: 'INTEGER',
        },
    ],
    async execute(message, args, language) {
        await create(message, args, language);
    },
    slashCommand: {
        async execute(interaction, language) {
            await create(interaction, [interaction.options.getInteger('max')], language);
        },
    },
};
