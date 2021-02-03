<<<<<<< HEAD
module.exports = {
	name: 'create',
	cooldown: 10,
	aliases: ['backup'],
	description: 'Create a server backup',
	execute(message, args) {
        backup = require("discord-backup");
        const prefix = 'c!';
        if (args.length < 1) {
            var max = 10;
        } else {
            var max = args[0];
        };
        backup.setStorageFolder("./my-backups/");
        // Check member permissions
        if(!message.member.hasPermission("ADMINISTRATOR")){
            return message.channel.send(":x: | You must be an administrator of this server to request a backup!");
        }
        // Create the backup
        backup.create(message.guild, {
            maxMessagesPerChannel: max,
            jsonSave: true,
            jsonBeautify: true,
            saveImages: 'base64'
        }).then((backupData) => {
            // And send informations to the backup owner
            message.author.send("The backup has been created! To load it, type this command on the server of your choice: `"+prefix+"load "+backupData.id+"`!");
            message.channel.send(":white_check_mark: Backup successfully created. The backup ID was sent in dm!");
        });
	},
=======
module.exports = {
	name: 'create',
	cooldown: 10,
	aliases: ['backup'],
	description: 'Create a server backup',
	execute(message, args) {
        backup = require("discord-backup");
        const prefix = 'c!';
        if (args.length < 1) {
            var max = 10;
        } else {
            var max = args[0];
        };
        backup.setStorageFolder("./my-backups/");
        // Check member permissions
        if(!message.member.hasPermission("ADMINISTRATOR")){
            return message.channel.send(":x: | You must be an administrator of this server to request a backup!");
        }
        // Create the backup
        backup.create(message.guild, {
            maxMessagesPerChannel: max,
            jsonSave: true,
            jsonBeautify: true,
            saveImages: 'base64'
        }).then((backupData) => {
            // And send informations to the backup owner
            message.author.send("The backup has been created! To load it, type this command on the server of your choice: `"+prefix+"load "+backupData.id+"`!");
            message.channel.send(":white_check_mark: Backup successfully created. The backup ID was sent in dm!");
        });
	},
>>>>>>> cbde5418c9694fd6f96015a1a518fdeff848bf7a
};