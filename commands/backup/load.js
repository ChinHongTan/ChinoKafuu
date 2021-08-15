module.exports = {
    name: "load",
    cooldown: 10,
    guildOnly: true,
    permissions: "ADMINISTRATOR",
    description: true,
    async execute(message, args, language) {
        const backup = require("discord-backup");
        const fs = require("fs");
        // Check member permissions
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(language.notAdminLoad);
        
        let backupID = args[0];
        if (!backupID) return message.channel.send(language.invalidBackupID);
        let rawdata;
        try {
            rawdata = fs.readFileSync("./my-backups/" + backupID + ".json");
        } catch (err) {
            return message.channel.send(language.noBackupFound.replace("${backupID}", backupID));
        }
        var serverbackup = JSON.parse(rawdata);
        let data = JSON.stringify(serverbackup, null, 2);
        var filename = backupID + ".json";
        fs.writeFileSync("./my-backups/" + filename, data);
        // Fetching the backup to know if it exists
        try {
            var backupData = JSON.parse(fs.readFileSync("./my-backups/" + backupID + ".json"));
            // If the backup exists, request for confirmation
            message.channel.send(language.warningBackup);
            await message.channel
                .awaitMessages((m) => m.author.id === message.author.id && m.content === "-confirm",
                    {
                        max: 1,
                        time: 20000,
                        errors: ["time"],
                    }
                )
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
                    maxMessaggesPerChannel: 100000,
                })
                .then(() => {
                    // When the backup is loaded, delete them from the server
                    backup.remove(backupID);
                })
                .catch((err) => {
                    console.error(err);
                    // If an error occurred
                    return message.author.send(language.backupError);
                });
        } catch (err) {
            console.log(err);
            // if the backup wasn't found
            return message.channel.send(language.noBackupFound.replace("${backupID}", backupID));
        }
    },
};
