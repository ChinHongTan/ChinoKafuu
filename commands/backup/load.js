const { reply } = require('../../functions/commandReply.js');
const fs = require('fs');
const backup = require('discord-backup');

async function load(command, args, language) {
    const author = command?.user || command?.author;
    // Check member permissions
    if (!command.member.permissions.has('ADMINISTRATOR')) return reply(command, language.notAdmin, 'RED');

    const backupID = args[0];
    if (!backupID) return reply(command, language.invalidBackupID, 'RED');
    // If backup doesn't exist
    if (!fs.existsSync(`./my-backups/${backupID}.json`)) return reply(command, language.noBackupFound.replace('${backupID}', backupID), 'RED');
    // Fetching the backup
    const backupData = JSON.parse(fs.readFileSync(`./my-backups/${backupID}.json`, 'utf-8'));
    // If the backup exists, request for confirmation
    await reply(command, language.warningBackup, 'YELLOW');
    const filter = (m) => m.author.id === author.id && m.content === '-confirm';
    let confirm = false;
    await command.channel
        .awaitMessages(
            {
                filter,
                max: 1,
                time: 20000,
                errors: ['time'],
            })
        .catch((collected) => {
            // if the author of the commands does not confirm the backup loading
            if (collected.size < 1) return reply(command, language.timesUpBackup, 'RED');
            confirm = true;
        });
    if (confirm) {
        // When the author of the command has confirmed that he wants to load the backup on his server
        await author.send(language.startLoadingBackup);
        // Load the backup
        backup
            .load(backupData, command.guild, {
                clearGuildBeforeRestore: true,
                maxMessagesPerChannel: 100000,
            })
            .catch((err) => {
                console.error(err);
                // If an error occurred
                return author.send(language.backupError);
            });
    }
}

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
    options: [
        {
            name: 'id',
            description: {
                'en_US': 'Backup ID',
                'zh_CN': '备份ID',
                'zh_TW': '備份ID',
            },
            type: 'INTEGER',
            required: true,
        },
    ],
    async execute(message, args, language) {
        await load(message, args, language);
    },
    slashCommand: {
        async execute(interaction, language) {
            await load(interaction, [interaction.options.getInteger('id')], language);
        },
    },
};
