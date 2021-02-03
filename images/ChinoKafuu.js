<<<<<<< HEAD
// Load modules
const Discord = require("discord.js"),
backup = require("discord-backup"),
client = new Discord.Client(),
settings = {
    prefix: "b!",
    token: "NzgxMzI4MjE4NzUzODU5NjM1.X78Cmw.GQ1bddBQTSl26q5zctYrD8tuSlk"
};

async function clearGuild(guild) {
    guild.roles.cache
        .filter((role) => !role.managed && role.editable && role.id !== guild.id)
        .forEach((role) => {
            role.delete().catch(() => {});
        });
    guild.channels.cache.forEach((channel) => {
        channel.delete().catch(() => {});
    });
    guild.emojis.cache.forEach((emoji) => {
        emoji.delete().catch(() => {});
    });
    const webhooks = await guild.fetchWebhooks();
    webhooks.forEach((webhook) => {
        webhook.delete().catch(() => {});
    });
    const bans = await guild.fetchBans();
    bans.forEach((ban) => {
        guild.members.unban(ban.user).catch(() => {});
    });
    const integrations = await guild.fetchIntegrations();
    integrations.forEach((integration) => {
        integration.delete();
    });
    guild.setAFKChannel(null);
    guild.setAFKTimeout(60 * 5);
    guild.setIcon(null);
    guild.setBanner(null).catch(() => {});
    guild.setSplash(null).catch(() => {});
    guild.setDefaultMessageNotifications('MENTIONS');
    guild.setWidget({
        enabled: false,
        channel: null
    });
    if(!guild.features.includes('COMMUNITY')){
        guild.setExplicitContentFilter('DISABLED');
        guild.setVerificationLevel('NONE');
    }
    guild.setSystemChannel(null);
    guild.setSystemChannelFlags(['WELCOME_MESSAGE_DISABLED', 'BOOST_MESSAGE_DISABLED']);
    return;
}
 
client.on("ready", () => {
    console.log("I'm ready !");
});
 
client.on("message", async message => {
 
    // This reads the first part of your message behind your prefix to see which command you want to use.
    let command = message.content.toLowerCase().slice(settings.prefix.length).split(" ")[0];
 
    // These are the arguments behind the commands.
    let args = message.content.split(" ").slice(1);
 
    // If the message does not start with your prefix return.
    // If the user that types a message is a bot account return.
    // If the command comes from DM return.
    if (!message.content.startsWith(settings.prefix) || message.author.bot || !message.guild) return;
 
    if(command === "create"){
        // Check member permissions
        /*
        if(!message.member.hasPermission("ADMINISTRATOR")){
            return message.channel.send(":x: | You must be an administrator of this server to request a backup!");
        }
        */
        // Create the backup
        message.channel.send(":white_check_mark: | Creating backup...");
        backup.setStorageFolder("C:/Users/User/Desktop/image"+"/my-backups/");
        backup.create(message.guild, {
            maxMessagesPerChannel: 50,
            jsonSave: true,
            jsonBeautify: true,
            saveImages: "base64"
        }).then((backupData) => {
            // And send informations to the backup owner
            message.author.send("The backup has been created! To load it, type this command on the server of your choice: `"+settings.prefix+"load "+backupData.id+"`!");
            message.channel.send(":white_check_mark: Backup successfully created. The backup ID was sent in dm!");
        });
    }
 
    if(command === "load"){
        // Check member permissions
        if(!message.member.hasPermission("ADMINISTRATOR")){
            return message.channel.send(":x: | You must be an administrator of this server to load a backup!");
        }
        let backupID = args[0];
        if(!backupID){
            return message.channel.send(":x: | You must specify a valid backup ID!");
        }
        // Fetching the backup to know if it exists
        backup.fetch(backupID).then(async () => {
            // If the backup exists, request for confirmation
            message.channel.send(":warning: | When the backup is loaded, all the channels, roles, etc. will be replaced! Type `-confirm` to confirm!");
                await message.channel.awaitMessages(m => (m.author.id === message.author.id) && (m.content === "-confirm"), {
                    max: 1,
                    time: 20000,
                    errors: ["time"]
                }).catch((err) => {
                    // if the author of the commands does not confirm the backup loading
                    return message.channel.send(":x: | Time's up! Cancelled backup loading!");
                });
                // When the author of the command has confirmed that he wants to load the backup on his server
                message.author.send(":white_check_mark: | Start loading the backup!");
                // Load the backup
                backup.load(backupID, message.guild, {
                    clearGuildBeforeRestore: true,
                    maxMessagesPerChannel: 50
                }).then(() => {
                    // When the backup is loaded, delete them from the server
                    message.author.send(":white_check_mark: | Done loading backup!");
                    backup.remove(backupID);
                }).catch((err) => {
                    // If an error occurred
                    return message.author.send(":x: | Sorry, an error occurred... Please check that I have administrator permissions!");
                });
        }).catch((err) => {
            console.log(err);
            // if the backup wasn't found
            return message.channel.send(":x: | No backup found for `"+backupID+"`!");
        });
    }
 
    if(command === "infos"){
        let backupID = args[0];
        if(!backupID){
            return message.channel.send(":x: | You must specify a valid backup ID!");
        }
        // Fetch the backup
        backup.fetch(backupID).then((backupInfos) => {
            const date = new Date(backupInfos.data.createdTimestamp);
            const yyyy = date.getFullYear().toString(), mm = (date.getMonth()+1).toString(), dd = date.getDate().toString();
            const formatedDate = `${yyyy}/${(mm[1]?mm:"0"+mm[0])}/${(dd[1]?dd:"0"+dd[0])}`;
            let embed = new Discord.MessageEmbed()
                .setAuthor("Backup Informations")
                // Display the backup ID
                .addField("Backup ID", backupInfos.id, false)
                // Displays the server from which this backup comes
                .addField("Server ID", backupInfos.data.guildID, false)
                // Display the size (in mb) of the backup
                .addField("Size", `${backupInfos.size} mb`, false)
                // Display when the backup was created
                .addField("Created at", formatedDate, false)
                .setColor("#FF0000");
            message.channel.send(embed);
        }).catch((err) => {
            // if the backup wasn't found
            return message.channel.send(":x: | No backup found for `"+backupID+"`!");
        });
    }

    if(command === 'clear'){
        if(!message.member.hasPermission("ADMINISTRATOR")){
            return message.channel.send(":x: | You must be an administrator of this server to load a backup!");
        }
        message.author.send(`Clearing ${message.guild.name}...`)
        clearGuild(message.guild);
    }
 
});
 
//Your secret token to log the bot in. (never share this to anyone!)
=======
// Load modules
const Discord = require("discord.js"),
backup = require("discord-backup"),
client = new Discord.Client(),
settings = {
    prefix: "b!",
    token: "NzgxMzI4MjE4NzUzODU5NjM1.X78Cmw.GQ1bddBQTSl26q5zctYrD8tuSlk"
};

async function clearGuild(guild) {
    guild.roles.cache
        .filter((role) => !role.managed && role.editable && role.id !== guild.id)
        .forEach((role) => {
            role.delete().catch(() => {});
        });
    guild.channels.cache.forEach((channel) => {
        channel.delete().catch(() => {});
    });
    guild.emojis.cache.forEach((emoji) => {
        emoji.delete().catch(() => {});
    });
    const webhooks = await guild.fetchWebhooks();
    webhooks.forEach((webhook) => {
        webhook.delete().catch(() => {});
    });
    const bans = await guild.fetchBans();
    bans.forEach((ban) => {
        guild.members.unban(ban.user).catch(() => {});
    });
    const integrations = await guild.fetchIntegrations();
    integrations.forEach((integration) => {
        integration.delete();
    });
    guild.setAFKChannel(null);
    guild.setAFKTimeout(60 * 5);
    guild.setIcon(null);
    guild.setBanner(null).catch(() => {});
    guild.setSplash(null).catch(() => {});
    guild.setDefaultMessageNotifications('MENTIONS');
    guild.setWidget({
        enabled: false,
        channel: null
    });
    if(!guild.features.includes('COMMUNITY')){
        guild.setExplicitContentFilter('DISABLED');
        guild.setVerificationLevel('NONE');
    }
    guild.setSystemChannel(null);
    guild.setSystemChannelFlags(['WELCOME_MESSAGE_DISABLED', 'BOOST_MESSAGE_DISABLED']);
    return;
}
 
client.on("ready", () => {
    console.log("I'm ready !");
});
 
client.on("message", async message => {
 
    // This reads the first part of your message behind your prefix to see which command you want to use.
    let command = message.content.toLowerCase().slice(settings.prefix.length).split(" ")[0];
 
    // These are the arguments behind the commands.
    let args = message.content.split(" ").slice(1);
 
    // If the message does not start with your prefix return.
    // If the user that types a message is a bot account return.
    // If the command comes from DM return.
    if (!message.content.startsWith(settings.prefix) || message.author.bot || !message.guild) return;
 
    if(command === "create"){
        // Check member permissions
        /*
        if(!message.member.hasPermission("ADMINISTRATOR")){
            return message.channel.send(":x: | You must be an administrator of this server to request a backup!");
        }
        */
        // Create the backup
        message.channel.send(":white_check_mark: | Creating backup...");
        backup.setStorageFolder("C:/Users/User/Desktop/image"+"/my-backups/");
        backup.create(message.guild, {
            maxMessagesPerChannel: 50,
            jsonSave: true,
            jsonBeautify: true,
            saveImages: "base64"
        }).then((backupData) => {
            // And send informations to the backup owner
            message.author.send("The backup has been created! To load it, type this command on the server of your choice: `"+settings.prefix+"load "+backupData.id+"`!");
            message.channel.send(":white_check_mark: Backup successfully created. The backup ID was sent in dm!");
        });
    }
 
    if(command === "load"){
        // Check member permissions
        if(!message.member.hasPermission("ADMINISTRATOR")){
            return message.channel.send(":x: | You must be an administrator of this server to load a backup!");
        }
        let backupID = args[0];
        if(!backupID){
            return message.channel.send(":x: | You must specify a valid backup ID!");
        }
        // Fetching the backup to know if it exists
        backup.fetch(backupID).then(async () => {
            // If the backup exists, request for confirmation
            message.channel.send(":warning: | When the backup is loaded, all the channels, roles, etc. will be replaced! Type `-confirm` to confirm!");
                await message.channel.awaitMessages(m => (m.author.id === message.author.id) && (m.content === "-confirm"), {
                    max: 1,
                    time: 20000,
                    errors: ["time"]
                }).catch((err) => {
                    // if the author of the commands does not confirm the backup loading
                    return message.channel.send(":x: | Time's up! Cancelled backup loading!");
                });
                // When the author of the command has confirmed that he wants to load the backup on his server
                message.author.send(":white_check_mark: | Start loading the backup!");
                // Load the backup
                backup.load(backupID, message.guild, {
                    clearGuildBeforeRestore: true,
                    maxMessagesPerChannel: 50
                }).then(() => {
                    // When the backup is loaded, delete them from the server
                    message.author.send(":white_check_mark: | Done loading backup!");
                    backup.remove(backupID);
                }).catch((err) => {
                    // If an error occurred
                    return message.author.send(":x: | Sorry, an error occurred... Please check that I have administrator permissions!");
                });
        }).catch((err) => {
            console.log(err);
            // if the backup wasn't found
            return message.channel.send(":x: | No backup found for `"+backupID+"`!");
        });
    }
 
    if(command === "infos"){
        let backupID = args[0];
        if(!backupID){
            return message.channel.send(":x: | You must specify a valid backup ID!");
        }
        // Fetch the backup
        backup.fetch(backupID).then((backupInfos) => {
            const date = new Date(backupInfos.data.createdTimestamp);
            const yyyy = date.getFullYear().toString(), mm = (date.getMonth()+1).toString(), dd = date.getDate().toString();
            const formatedDate = `${yyyy}/${(mm[1]?mm:"0"+mm[0])}/${(dd[1]?dd:"0"+dd[0])}`;
            let embed = new Discord.MessageEmbed()
                .setAuthor("Backup Informations")
                // Display the backup ID
                .addField("Backup ID", backupInfos.id, false)
                // Displays the server from which this backup comes
                .addField("Server ID", backupInfos.data.guildID, false)
                // Display the size (in mb) of the backup
                .addField("Size", `${backupInfos.size} mb`, false)
                // Display when the backup was created
                .addField("Created at", formatedDate, false)
                .setColor("#FF0000");
            message.channel.send(embed);
        }).catch((err) => {
            // if the backup wasn't found
            return message.channel.send(":x: | No backup found for `"+backupID+"`!");
        });
    }

    if(command === 'clear'){
        if(!message.member.hasPermission("ADMINISTRATOR")){
            return message.channel.send(":x: | You must be an administrator of this server to load a backup!");
        }
        message.author.send(`Clearing ${message.guild.name}...`)
        clearGuild(message.guild);
    }
 
});
 
//Your secret token to log the bot in. (never share this to anyone!)
>>>>>>> cbde5418c9694fd6f96015a1a518fdeff848bf7a
client.login(settings.token);