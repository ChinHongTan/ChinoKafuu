const { SlashCommandBuilder } = require('@discordjs/builders');
const { reply } = require('../../functions/commandReply.js');
const fs = require('fs');
const backup = require('discord-backup');
const { interactionCommand } = require('discord.js');

async function load(command, args, language) {
    const author = command instanceof interactionCommand ? command.user : command.author;
    // Check member permissions
    if (!command.member.permissions.has('ADMINISTRATOR')) return reply(command, language.notAdmin, 'RED');

    const backupID = args[0];
    if (!backupID) return reply(command, language.invalidBackupID, 'RED');
    let rawData;
    try {
        rawData = fs.readFileSync(`./my-backups/${backupID}.json`);
    } catch (err) {
        return reply(command, language.noBackupFound.replace('${backupID}', backupID), 'RED');
    }
    const serverBackup = JSON.parse(rawData);
    const data = JSON.stringify(serverBackup, null, 2);
    const filename = `${backupID}.json`;
    fs.writeFileSync(`./my-backups/${filename}`, data);
    // Fetching the backup to know if it exists
    try {
        const backupData = JSON.parse(fs.readFileSync(`./my-backups/${backupID}.json`, 'utf-8'));
        // If the backup exists, request for confirmation
        await reply(command, language.warningBackup, 'YELLOW');
        const filter = (m) => m.author.id === author.id && m.content === '-confirm';
        await command.channel
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
                return reply(command, language.timesUpBackup, 'RED');
            });
        // When the author of the command has confirmed that he wants to load the backup on his server
        author.send(language.startLoadingBackup);
        // Load the backup
        backup
            .load(backupData, command.guild, {
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
                return author.send(language.backupError);
            });
    } catch (err) {
        console.log(err);
        // if the backup wasn't found
        return reply(command, language.noBackupFound.replace('${backupID}', backupID), 'RED');
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
    async execute(message, args, language) {
        await load(message, args, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder()
            .addIntegerOption((option) => option.setName('id').setDescription('backup id')),
        async execute(interaction, language) {
            await load(interaction, [interaction.option.getInteger('id')], language);
        },
    },
};
