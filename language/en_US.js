/* eslint quotes: 0 */
module.exports = {
    "backup": {
        "invalidBackupID":"You must specify a valid backup ID!",
        "backupInformation":"Backup Information",
        "backupID":"Backup ID",
        "serverID":"Server ID",
        "backupSize":"Size",
        "backupCreatedAt":"Created at",
        "noBackupFound":"No backup found for \\`${backupID}\\` !",
        "notAdmin":"You must be an administrator of this server to request a backup!",
        "startBackup":"Start creating backup...\nMax Messages per Channel: ${max}\nSave Images: base64",
        "doneBackupDM":"✅ | The backup has been created! To load it, type this command on the server of your choice: \\`${prefix}load ${backupData.id}\\`!",
        "doneBackupGuild":"Backup successfully created. The backup ID was sent in dm!",
        "warningBackup": "When the backup is loaded, all the channels, roles, etc. will be replaced! Type `-confirm` to confirm!",
        "timesUpBackup": "Time's up! Cancelled backup loading!",
        "startLoadingBackup": "✅ | Start loading the backup!",
        "backupError": "🆘 | Sorry, an error occurred... Please check that I have administrator permissions!",
        "doneLoading": "✅ | Backup loaded successfully!",
        "outOfRange": "Max messages per channel cannot exceed 1000 or lower than 0!",
    },
    "8ball": {
        "noQuestion": "Psst. You need to ask the 8ball a question, you know?",
        "reply1": "It is certain",
        "reply2": "It is decidedly so",
        "reply3": "Without a doubt",
        "reply4": "Yes, definitely",
        "reply5": "You may rely on it",
        "reply6": "As I see it, yes",
        "reply7": "Most likely",
        "reply8": "Outlook good",
        "reply9": "Yes",
        "reply10": "Signs point to yes",
        "reply11": "Reply hazy try again",
        "reply12": "Ask again later",
        "reply13": "Better not tell you now",
        "reply14": "Cannot predict now",
        "reply15": "Concentrate and ask again",
        "reply16": "Don't count on it",
        "reply17": "My reply is no",
        "reply18": "My sources say no",
        "reply19": "Outlook not so good",
        "reply20": "Very doubtful",
        "reply": "Our 🎱 replied with:",
    },
    "connect4": {
        "board": "It's now ${round.name}'s turn!\n${boardStr}",
        "invalidMove": "You can’t place the piece here!",
        "win": "${round.name} had won the game!",
    },
    "loli": {
        "noToken": "This command can't be used without pixiv refreshToken!",
    },
    "pixiv": {
        "noToken": "This command can't be used without pixiv refreshToken!",
        "noIllust": "Illust doesn't exist!",
        "noUser": "User doesn't exist!",
        "noResult": "No result found!",
        "unknownSubcommand": "Invalid subcommand used!",
    },
    "updateIllust": {
        "noToken": "This command can't be used without pixiv refreshToken!",
    },
    "yt-together": {
        "notInVC": "You have to join a voice channel before using this command!",
    },
    "anime": {
        "similarity": "Similarity: ${similarity * 100}%",
        "sourceURL": "**Source URL**",
        "nativeTitle": "Native Title",
        "romajiTitle": "Romaji Title",
        "englishTitle": "English Title",
        "episode": "Episode",
        "NSFW": "NSFW",
        "invalidURL": "Please enter a valid http url!",
        "noImage": "You have to upload an image before using this command!",
    },
    "avatar": {
        "yourAvatar": "__Your avatar__",
        "userAvatar": "__${user.username}'s avatar__",
        "memberAvatar": "__${user.displayName}'s avatar__",
        "noMember": "Can't find a member matching \\`${keyword}\\`!",
    },
    "google": {
    },
    "help": {
        "helpTitle": "List of commands",
        "helpPrompt": "Here's a list of all my commands:",
        "helpPrompt2": "\nYou can send \\`${prefix}help [command name]\\` to get info on a specific command!",
        "helpSend": "I've sent you a DM with all my commands!",
        "invalidCmd": "That's not a valid command!",
        "cmdName": "**Name:**",
        "cmdAliases": "**Aliases:**",
        "cmdDescription": "**Description:**",
        "cmdUsage": "**Usage:**",
        "cmdCoolDown": "**Cool down:**",
    },
    "invite": {
        "invite": "Invite me!",
    },
    "run": {
        "invalidUsage": "Invalid usage! Invalid language/code.",
        "wait": "Please wait...",
        "usage": "Usage: c!run <language> [code](with or without code block)",
        "notSupported": "Language not supported!",
        "outputTooLong": "Output was too long (more than 2000 characters or 40 lines) so I put it here: ${link}",
        "postError": "Your output was too long, but I couldn't make an online bin out of it",
        "noOutput": "No output!",
    },
    "sauce": {
        "similarity": "Similarity: ${similarity}%",
        "sourceURL": "**Source URL**",
        "searchingSauce": "Searching for image...",
        "additionalInfo": "Additional info",
        "noAuthor": "No info found!",
        "sauceAuthor": "Name: ${authorInfo.name}\nLink: ${authorInfo.url}",
        "title":"Title",
        "author":"Author",
    },
    "server": {
        "serverInfo": "Server Info",
        "serverName": "Server name",
        "serverOwner": "Server owner",
        "memberCount": "Member count",
        "serverRegion": "Server region",
        "highestRole": "Highest role",
        "serverCreatedAt": "Server created at",
        "channelCount": "Channel count",
    },
    "user-info": {
        "customStatus": "__Custom Status__\n<:${name}:${id}> ${state}\n",
        "gameStatus": "__${type}__\n${name}\n${details}",
        "notPlaying": "User is not playing.",
        "uiTitle": "User Info",
        "tag": "Tag",
        "nickname": "Nickname",
        "id": "ID",
        "avatarURL": "Avatar URL",
        "avatarValue": "[Click here](${url})",
        "createdAt": "Created At",
        "joinedAt": "Joined At",
        "activity": "Activity",
        "none": "None",
        "status": "Status",
        "device": "Device",
        "roles": "Roles(${author.roles.cache.size})",
    },
    "ban": {
        "noMention": "You need to mention a user in order to ban them!",
        "cantBanSelf": "You Cannot Ban Yourself!",
        "cannotBan": "Cannot Ban This User!",
        "banSuccess": "Successfully Banned: ${taggedUser.user.username}!",
    },
    "kick": {
        "noMention": "You need to mention a user in order to kick them!",
        "cantKickSelf": "You Cannot Kick Yourself!",
        "cannotKick": "Cannot Kick This User!",
        "kickSuccess": "Successfully Kicked: ${taggedUser.user.username}!",
    },
    "prune": {
        "invalidNum": "That doesn't seem to be a valid number.",
        "notInRange": "You need to input a number between 1 and 99.",
        "pruneError": "There was an error trying to prune messages in this channel!",
    },
    "clear": {
        "cleared": "Song queue cleared!",
    },
    "loop": {
        "on": "Loop mode on!",
        "off": "Loop mode off!",
    },
    "loop-queue": {
        "on": "Loop queue mode on!",
        "off": "Loop queue mode off!",
    },
    "lyric": {
        "searching": ":mag: | Searching lyrics for ${keyword}...",
        "noLyricsFound": "No lyrics found for `${keyword}`!",
        "title": "Lyric for `${keyword}`",
        "noKeyword": "No keyword given!",
        "pause": "Paused!",
    },
    "now-playing": {
        "npTitle": "**Now playing ♪**",
        "requester": "Requested by:",
        "musicFooter": "Music system",
        "pause": "Paused!",
    },
    "pause": {
        "pause": "Paused!",
    },
    "play": {
        "notInVC": "You have to join a voice channel before using this command!",
        "cantJoinVC": "I need the permissions to join and speak in your voice channel!",
        "importAlbum1": "✅ | Album: **${title}** importing",
        "importAlbum2": "✅ | Album: **${videos[0].title}** importing **${i}**",
        "importAlbumDone": "✅ | Album: **${title}** has been added to the queue!",
        "importPlaylist1": "✅ | Playlist: **${title}** importing",
        "importPlaylist2": "✅ | PlayList: **${videos[0].title}** importing **${i}**",
        "importPlaylistDone": "✅ | Playlist: **${title}** has been added to the queue!",
        "noResult": "🆘 | I could not obtain any search results.",
        "noArgs": "Please provide an argument!",
        "searching":"🔍 | Searching ${keyword}...",
        "choose":"Choose a song",
        "timeout":"Timeout",
    },
    "queue": {
        "queueTitle": "Song Queue",
        "queueBody": "**Now playing**\n[${serverQueue.songs[0].title}](${serverQueue.songs[0].url})\n\n**Queued Songs**\n${printQueue}\n${serverQueue.songs.length - 1} songs in queue",
    },
    "related": {
        "relatedSearch": "🔍 | Searching for related tracks...",
        "noResult": "I could not obtain any search results.",
    },
    "remove": {
        "removed": "Removed ${serverQueue.songs[queuenum].title}!",
        "invalidInt": "You have to enter a valid integer!",
    },
    "resume": {
        "playing": "I'm already playing!",
        "resume": "Resumed!",
    },
    "skip": {
        "skipped": "Skipped the song.",
    },
    "stop": {
        "stopped": "Stopped playing songs.",
    },
    "set": {
        "languageNotSupported": "Language not supported!",
        "changeSuccess": "Language changed successfully to `${args[0]}`!",
        "argsNotChannel": "Argument not a channel!",
        "argsNotRole": "Argument not a role!",
        "argsNotNumber": "Argument not a number!",
        "noRole": "No role provided!",
        "logChannelChanged": "Changed my log channel to ${args[0]}!",
        "starboardChanged": "Changed starboard channel to ${args[0]}!",
        "levelRewardAdded": "Added level reward: ${args[0]} => ${args[1]}!",
        "levelRewardRemoved": "Removed level reward: ${args[0]} => ${args[1]}!",
    },
    "cemoji": {
        "noEmoji": "Please specify an emoji to add!",
        "addSuccess": "The emoji \\`${emoji.name}\\` ${emoji} was successfully added to the server!",
    },
    "edit-snipe": {
        "exceed10": "You can't snipe beyond 10!",
        "invalidSnipe": "Not a valid snipe!",
        "noSnipe":"There's nothing to snipe!",
    },
    "snipe": {
        "exceed10": "You can't snipe beyond 10!",
        "invalidSnipe": "Not a valid snipe!",
        "noSnipe":"There's nothing to snipe!",
    },
    "ping": {
        "pinging": "Pinging...",
        "heartbeat": "Websocket heartbeat:",
        "latency": "Round trip latency:",
    },
};