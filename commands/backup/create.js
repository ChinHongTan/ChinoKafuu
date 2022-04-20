const { SlashCommandBuilder } = require('@discordjs/builders');
const { reply } = require('../../functions/commandReply.js');
const backup = require('discord-backup');
const prefix = process.env.PREFIX || require('../../config/config.json').prefix;

async function create(command, args, language) {
    const user = command?.user || command?.author;
    const max = args[0] ?? 10;
    backup.setStorageFolder('./my-backups');
    // Check member permissions
    if (!command.member.permissions.has('ADMINISTRATOR')) {
        return reply(command, language.notAdmin, 'RED');
    }
    // Create the backup
    await reply(command, language.startBackup.replace('${max}', max), 'GREEN');
    const backupData = await backup
        .create(command.guild, {
            maxMessagesPerChannel: max,
            jsonSave: true,
            jsonBeautify: true,
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
    await reply(command, language.doneBackupGuild, 'GREEN');
}

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
        await create(message, args, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder()
            .addIntegerOption((option) => option.setName('max').setDescription('max message per channel')),
        async execute(interaction, language) {
            await create(interaction, [interaction.options.getInteger('max')], language);
        },
    },
};
