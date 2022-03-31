module.exports = {
    name: 'backup-info',
    cooldown: 10,
    aliases: ['bi'],
    description: true,
    execute(message, args, language) {
        const backup = require('discord-backup');
        const Discord = require('discord.js');

        const backupID = args[0];

        if (!backupID) return message.channel.send(language.invalidBackupID);
        // Fetch the backup
        backup
            .fetch(backupID)
            .then((backupInfos) => {
                const date = new Date(backupInfos.data.createdTimestamp);
                const yyyy = date.getFullYear().toString();
                const mm = (date.getMonth() + 1).toString();
                const dd = date.getDate().toString();
                const formatedDate = `${yyyy}/${mm[1] ? mm : `0${mm[0]}`}/${
                    dd[1] ? dd : `0${dd[0]}`
                }`;
                const embed = new Discord.MessageEmbed()
                    .setAuthor(language.backupInformations)
                // Display the backup ID
                    .addField(language.backupID, backupInfos.id, false)
                // Displays the server from which this backup comes
                    .addField(language.serverID, backupInfos.data.guildID, false)
                // Display the size (in mb) of the backup
                    .addField(language.size, `${backupInfos.size} kb`, false)
                // Display when the backup was created
                    .addField(language.backupCreatedAt, formatedDate, false)
                    .setColor('#FF0000');
                message.channel.send(embed);
            })
            .catch((err) => {
                // if the backup wasn't found
                console.log(err);
                return message.channel.send(language.noBackupFound.replace('${backupID}', backupID));
            });
    },
};
