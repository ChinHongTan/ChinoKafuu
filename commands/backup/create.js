module.exports = {
    name: "create",
    cooldown: 10,
    aliases: ["backup"],
    guildOnly: true,
    description: "Create a server backup",
    async execute(message, args) {
        const backup = require("discord-backup");
        const prefix = process.env.PREFIX || require("../../config/config.json").prefix;
        let max = (args.length < 1) ? 10 : args[0];
        backup.setStorageFolder("./my-backups/");
        // Check member permissions
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(":x: | You must be an administrator of this server to request a backup!");
        }
        // Create the backup
        message.channel.send(`Start creating backup...\nMax Messages per Channel: ${max}\nSave Images: base64`);
        let backupData = await backup
            .create(message.guild, {
                maxMessagesPerChannel: max,
                jsonSave: true,
                jsonBeautify: true,
                saveImages: "base64",
            });
        // And send informations to the backup owner
        message.author.send("The backup has been created! To load it, type this command on the server of your choice: `" + prefix + "load " + backupData.id + "`!");
        message.channel.send(":white_check_mark: Backup successfully created. The backup ID was sent in dm!");
    },
};
