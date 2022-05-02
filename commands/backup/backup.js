const { error, success, warn, reply } = require('../../functions/Util.js');
const fs = require('fs');
const backup = require('discord-backup');
const { MessageEmbed } = require('discord.js');
const prefix = process.env.PREFIX || require('../../config/config.json').prefix;

function fetchData(command, args, language) {
    const backupID = command.options.getInteger('id') ?? args[1];
    if (!backupID) return error(command, language.invalidBackupID);
    // If backup doesn't exist
    if (!fs.existsSync(`./my-backups/${backupID}.json`)) return error(command, language.noBackupFound.replace('${backupID}', backupID));
    // Fetching the backup
    return JSON.parse(fs.readFileSync(`./my-backups/${backupID}.json`, 'utf-8'));
}

async function create(command, args, language) {
    const user = command?.user || command?.author;
    const max = command.options.getInteger('max') ?? args[1] ?? 10;
    if (max < 0 || max > 1000) return error(command, 'Cannot exceed 1000 or lower than 0!');
    backup.setStorageFolder('./my-backups');
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

async function load(command, args, language) {
    const user = command?.user || command?.author;
    const backupData = fetchData(command, args, language);

    // If the backup exists, request for confirmation
    await warn(command, language.warningBackup);
    const filter = (m) => m.author.id === user.id && m.content === '-confirm';
    let confirm;
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
            if (collected.size < 1) return error(command, language.timesUpBackup);
            confirm = true;
        });
    if (confirm) {
        // When the author of the command has confirmed that he wants to load the backup on his server
        await user.send(language.startLoadingBackup);
        // Load the backup
        backup
            .load(backupData, command.guild, {
                clearGuildBeforeRestore: true,
                maxMessagesPerChannel: 100000,
            })
            .catch((err) => {
                console.error(err);
                // If an error occurred
                return user.send(language.backupError);
            });
    }
}

async function bi(command, args, language) {
    const backupID = command.options.getInteger('id') ?? args[1];
    const backupData = fetchData(command, args, language);
    const backupInfo = {
        data: backupData,
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

async function backupFunc(command, args, language) {
    // Check member permissions
    if (!command.member.permissions.has('ADMINISTRATOR')) return error(command, language.notAdmin);
    switch (args[0]) {
    case 'create': {
        await create(command, args, language);
        break;
    }
    case 'load': {
        await load(command, args, language);
        break;
    }
    case 'info': {
        await bi(command, args, language);
    }
    }
}

module.exports = {
    name: 'backup',
    coolDown: 10,
    guildOnly: true,
    permissions: 'ADMINISTRATOR',
    description: {
        'en_US': 'Create a server backup',
        'zh_CN': '创建一个伺服备份',
        'zh_TW': '創建一個伺服備份',
    },
    subcommands: [
        {
            name: 'create',
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
                    min: 0,
                    max: 1000,
                },
            ],
        },
        {
            name: 'load',
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
        },
        {
            name: 'info',
            description: {
                'en_US': 'Load a backup info.',
                'zh_CN': '查询备份信息',
                'zh_TW': '查詢備份信息',
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
        },
    ],
    async execute(message, args, language) {
        await backupFunc(message, args, language);
    },
    slashCommand: {
        async execute(interaction, language) {
            await backupFunc(interaction, [interaction.options.getSubcommand()], language);
        },
    },
};
