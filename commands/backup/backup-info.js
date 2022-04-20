const { SlashCommandBuilder } = require('@discordjs/builders');
const { reply } = require('../../functions/commandReply.js');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const { existsSync } = require('fs');

async function bi(command, args, language) {
    const backupID = args[0];

    if (!backupID) return reply(command, language.invalidBackupID);

    if (!existsSync(`./my-backups/${backupID}.json`)) {// if the backup wasn't found
        return reply(command, language.noBackupFound.replace('${backupID}', backupID));
    }

    // Fetch the backup
    const backupFile = JSON.parse(fs.readFileSync(`./my-backups/${backupID}.json`, 'utf-8'));
    const backupInfo = {
        data: backupFile,
        id: backupID,
        size: (fs.statSync(`./my-backups/${backupID}.json`).size / (1024 * 1024)).toFixed(2), // in MB
    };

    const date = new Date(backupInfo.data.createdTimestamp);
    const yyyy = date.getFullYear().toString();
    const mm = (date.getMonth() + 1).toString();
    const dd = date.getDate().toString();
    const formattedDate = `${yyyy}/${mm[1] ? mm : `0${mm[0]}`}/${dd[1] ? dd : `0${dd[0]}`}`;
    const embed = new MessageEmbed()
        .setAuthor({ name: language.backupInformation })
        // Display the backup ID
        .addField(language.backupID, backupInfo.id, false)
        // Displays the server from which this backup comes
        .addField(language.serverID, backupInfo.data.guildID, false)
        // Display the size (in kb) of the backup
        .addField(language.backupSize, `${backupInfo.size} MB`, false)
        // Display when the backup was created
        .addField(language.backupCreatedAt, formattedDate, false)
        .setColor('#FF0000');
    return reply(command, { embeds: [embed] });
}
module.exports = {
    name: 'backup-info',
    cooldown: 10,
    aliases: ['bi'],
    description: {
        'en_US': 'Load a backup info.',
        'zh_CN': '查询备份信息',
        'zh_TW': '查詢備份信息',
    },
    async execute(message, args, language) {
        await bi(message, args, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder()
            .addIntegerOption((option) => option.setName('id').setDescription('backup id')),
        async execute(interaction, language) {
            await bi(interaction, [interaction.options.getInteger('id')], language);
        },
    },
};
