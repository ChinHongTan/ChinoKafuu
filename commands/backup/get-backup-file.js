const { SlashCommandBuilder } = require('@discordjs/builders');
const { reply } = require('../../functions/commandReply.js');
const fs = require('fs');

async function getBackupFile(command, args, language) {
    const backupID = args[0];
    if (!backupID) return reply(command, language.invalidBackupID, 'RED');
    let rawData;
    try {
        rawData = fs.readFileSync(`./my-backups/${backupID}.json`);
    } catch (err) {
        return reply(command, language.noBackupFound.replace('${backupID}', backupID), 'RED');
    }
    return reply(command, { content: `Backup file ID: \`${backupID}\``, files: rawData });
}

module.exports = {
    name: 'get-backup-file',
    cooldown: 10,
    guildOnly: true,
    permissions: 'ADMINISTRATOR',
    description: {
        'en_US': 'Load a server backup based on backup ID.',
        'zh_CN': '根据ID加载备份文件',
        'zh_TW': '根據ID加載備份文件',
    },
    async execute(message, args, language) {
        await getBackupFile(message, args, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder()
            .addIntegerOption((option) => option.setName('id').setDescription('backup id')),
        async execute(interaction, language) {
            await getBackupFile(interaction, [interaction.option.getInteger('id')], language);
        },
    },
};
