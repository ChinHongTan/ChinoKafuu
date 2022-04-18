module.exports = {
    name: 'load',
    cooldown: 10,
    guildOnly: true,
    permissions: 'ADMINISTRATOR',
    description: {
        'en_US': 'Load a server backup based on backup ID.',
        'zh_CN': '根据ID加载备份文件',
        'zh_TW': '根據ID加載備份文件',
    },
    async execute(message, args, language) {
        const backup = require('discord-backup');
        const fs = require('fs');
        // Check member permissions
        if (!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send(language.notAdmin);

        const backupID = args[0];
        if (!backupID) return message.channel.send(language.invalidBackupID);
        let rawData;
        try {
            rawData = fs.readFileSync(`./my-backups/${backupID}.json`);
        } catch (err) {
            return message.channel.send(language.noBackupFound.replace('${backupID}', backupID));
        }
        const serverBackup = JSON.parse(rawData);
        const data = JSON.stringify(serverBackup, null, 2);
        const filename = `${backupID}.json`;
        fs.writeFileSync(`./my-backups/${filename}`, data);
        // Fetching the backup to know if it exists
        try {
            const backupData = JSON.parse(fs.readFileSync(`./my-backups/${backupID}.json`, 'utf-8'));
            // If the backup exists, request for confirmation
            message.channel.send(language.warningBackup);
            const filter = (m) => m.author.id === message.author.id && m.content === '-confirm';
            await message.channel
                .awaitMessages(
                    {
                        filter,
                        max: 1,
                        time: 20000,
                        errors: ['time'],
                    })
                .catch((err) => {
                    console.error(err);
                    // if the author of the commands does not confirm the backup loading
                    return message.channel.send(language.timesUpBackup);
                });
            // When the author of the command has confirmed that he wants to load the backup on his server
            message.author.send(language.startLoadingBackup);
            // Load the backup
            backup
                .load(backupData, message.guild, {
                    clearGuildBeforeRestore: true,
                    maxMessagesPerChannel: 100000,
                })
                .then(() => {
                    // When the backup is loaded, delete them from the server
                    return backup.remove(backupID);
                })
                .catch((err) => {
                    console.error(err);
                    // If an error occurred
                    return message.author.send(language.backupError);
                });
        } catch (err) {
            console.log(err);
            // if the backup wasn't found
            return message.channel.send(language.noBackupFound.replace('${backupID}', backupID));
        }
    },
};
