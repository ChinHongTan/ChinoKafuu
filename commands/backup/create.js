module.exports = {
    name: 'create',
    cooldown: 10,
    aliases: ['backup'],
    guildOnly: true,
    permissions: 'ADMINISTRATOR',
    description: {
        'en_US': 'Create a server backup',
        'zh_CN': '创建一个伺服备份',
        'zh_TW': '創建一個伺服備份',
    },
    async execute(message, args, language) {
        const backup = require('discord-backup');
        const prefix = process.env.PREFIX || require('../../config/config.json').prefix;
        const max = (args.length < 1) ? 10 : args[0];
        backup.setStorageFolder('./my-backups/');
        // Check member permissions
        if (!message.member.hasPermission('ADMINISTRATOR')) {
            return message.channel.send(language.notAdminBackup);
        }
        // Create the backup
        message.channel.send(language.startBackup.replace('${max}', max));
        const backupData = await backup
            .create(message.guild, {
                maxMessagesPerChannel: max,
                jsonSave: true,
                jsonBeautify: true,
                saveImages: 'base64',
            });
        // And send informations to the backup owner
        message.author.send(language.doneBackupDM.replace('${prefix}', prefix).replace('${backupData.id}', backupData.id));
        message.channel.send(language.doneBackupGuild);
    },
};
