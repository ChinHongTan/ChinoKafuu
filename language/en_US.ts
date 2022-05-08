/* eslint quotes: 0 */
export const translation = {
    // backup
    "invalidBackupID":"You must specify a valid backup ID!",
    "backupInformation":"Backup Information",
    "backupID":"Backup ID",
    "serverID":"Server ID",
    "backupSize":"Size",
    "backupCreatedAt":"Created at",
    "noBackupFound":"No backup found for `%VAR%` !",
    "backupNotAdmin":"You must be an administrator of this server to request a backup!",
    "startBackup":"Start creating backup...\nMax Messages per Channel: %VAR%\nSave Images: base64",
    "doneBackupDM":"✅ | The backup has been created! To load it, type this command on the server of your choice: `%VAR%load %VAR%`!",
    "doneBackupGuild":"Backup successfully created. The backup ID was sent in dm!",
    "warningBackup": "When the backup is loaded, all the channels, roles, etc. will be replaced! Type `-confirm` to confirm!",
    "timesUpBackup": "Time's up! Cancelled backup loading!",
    "startLoadingBackup": "✅ | Start loading the backup!",
    "backupError": "🆘 | Sorry, an error occurred... Please check that I have administrator permissions!",
    "doneLoading": "✅ | Backup loaded successfully!",
    "backupOutOfRange": "Max messages per channel cannot exceed 1000 or lower than 0!",
    // 8ball
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
    // connect4
    "board": "It's now %VAR%'s turn!\n%VAR%",
    "invalidMove": "You can’t place the piece here!",
    "win": "%VAR% had won the game!",
    // loli
    "noToken": "This command can't be used without pixiv refreshToken!",

    // pixiv
    // - noToken in loli
    "noIllust": "Illust doesn't exist!",
    "noUser": "User doesn't exist!",
    "noResult": "🆘 | I could not obtain any search results.",
    "unknownSubcommand": "Invalid subcommand used!",

    // updateIllust
    // - noToken in loli

    //yt-together
    "notInVC": "You have to join a voice channel before using this command!",

    // anime
    "similarity": "Similarity: %VAR%%",
    "sourceURL": "**Source URL**",
    "nativeTitle": "Native Title",
    "romajiTitle": "Romaji Title",
    "englishTitle": "English Title",
    "episode": "Episode",
    "NSFW": "NSFW",
    "invalidURL": "Please enter a valid http url!",
    "noImage": "You have to upload an image before using this command!",

    // avatar
    "yourAvatar": "__Your avatar__",
    "userAvatar": "__%VAR%'s avatar__",
    "memberAvatar": "__%VAR%'s avatar__",
    "noMember": "Can't find a member matching `%VAR%`!",

    // covid
    "covidTitle": "**%VAR% COVID-19 data**",
    "totalCases": "Total cases",
    "confirmedToday": "Confirmed today",
    "totalDeaths": "Total deaths",
    "deathsToday": "Deaths today",
    "totalRecovered": "Total recovered",
    "recoveredToday": "Recovered today",
    "activeCases": "Active cases",
    "criticalCases": "Critical cases",
    "population": "Population",
    "covidFooter": "Requested by: %VAR%\nData updated: %VAR%",
    "invalidArgument": "Please provide a valid argument!",
    "covidExample": "eg: `c!covid global` or `c!covid countries`",

    // google

    //help
    "helpTitle": "List of commands",
    "helpPrompt": "Here's a list of all my commands:",
    "helpPrompt2": "\nYou can send `%VAR%help [command name]` to get info on a specific command!",
    "helpSend": "I've sent you a DM with all my commands!",
    "invalidCmd": "That's not a valid command!",
    "cmdName": "**Name:**",
    "cmdAliases": "**Aliases:**",
    "cmdDescription": "**Description:**",
    "cmdUsage": "**Usage:**",
    "cmdCoolDown": "**Cool down:**",

    // invite
    "invite": "Invite me!",

    // run
    "invalidUsage": "Invalid usage! Invalid language/code.",
    "wait": "Please wait...",
    "usage": "Usage: c!run <language> [code](with or without code block)",
    "notSupported": "Language not supported!",
    "outputTooLong": "Output was too long (more than 2000 characters or 40 lines) so I put it here: %VAR%",
    "postError": "Your output was too long, but I couldn't make an online bin out of it",
    "noOutput": "No output!",

    // sauce
    // similarity in anime
    // sourceURL in anime
    "searchingSauce": "Searching for image...",
    "additionalInfo": "Additional info",
    "noAuthor": "No info found!",
    "sauceAuthor": "Name: %VAR%\nLink: %VAR%",
    "sauceTitle":"Title",
    "author":"Author",

    // server
    "serverInfo": "Server Info",
    "serverName": "Server name",
    "serverOwner": "Server owner",
    "memberCount": "Member count",
    "serverRegion": "Server region",
    "highestRole": "Highest role",
    "serverCreatedAt": "Server created at",
    "channelCount": "Channel count",

    // user-info
    "customStatus": "__Custom Status__\n<:%VAR%:%VAR%> %VAR%\n",
    "gameStatus": "__%VAR%__\n%VAR%\n%VAR%",
    "notPlaying": "User is not playing.",
    "uiTitle": "User Info",
    "tag": "Tag",
    "nickname": "Nickname",
    "id": "ID",
    "avatarURL": "Avatar URL",
    "avatarValue": "[Click here](%VAR%)",
    "createdAt": "Created At",
    "joinedAt": "Joined At",
    "activity": "Activity",
    "none": "None",
    "status": "Status",
    "device": "Device",
    "roles": "Roles(%VAR%)",

    // ban
    "noMentionBan": "You need to mention a user in order to ban them!",
    "cantBanSelf": "You Cannot Ban Yourself!",
    "cannotBan": "Cannot Ban This User!",
    "banSuccess": "Successfully Banned: %VAR%!",

    // kick
    "noMentionKick": "You need to mention a user in order to kick them!",
    "cantKickSelf": "You Cannot Kick Yourself!",
    "cannotKick": "Cannot Kick This User!",
    "kickSuccess": "Successfully Kicked: %VAR%!",

    // prune
    "invalidNum": "That doesn't seem to be a valid number.",
    "notInRange": "You need to input a number between 1 and 99.",
    "pruneError": "There was an error trying to prune messages in this channel!",

    // clear
    "cleared": "Song queue cleared!",

    // loop
    "loopOn": "Loop mode on!",
    "loopOff": "Loop mode off!",

    // loop-queue
    "loopQueueOn": "Loop queue mode on!",
    "loopQueueOff": "Loop queue mode off!",

    // lyric
    "searching": "🔍 | Searching for %VAR%...",
    "noLyricsFound": "No lyrics found for `%VAR%`!",
    "title": "Lyric for `%VAR%`",
    "noKeyword": "No keyword given!",

    // now-playing
    "npTitle": "**Now playing ♪**",
    "requester": "Requested by:",
    "musicFooter": "Music system",

    // pause
    "pause": "Paused!",

    // play
    // notInVC in yt-together
    "cantJoinVC": "I need the permissions to join and speak in your voice channel!",
    "importAlbum1": "✅ | Album: **%VAR%** importing",
    "importAlbum2": "✅ | Album: **%VAR%** importing **%VAR%**",
    "importAlbumDone": "✅ | Album: **%VAR%** has been added to the queue!",
    "importPlaylist1": "✅ | Playlist: **%VAR%** importing",
    "importPlaylist2": "✅ | PlayList: **%VAR%** importing **%VAR%**",
    "importPlaylistDone": "✅ | Playlist: **%VAR%** has been added to the queue!",
    // noResult in pixiv
    "noArgs": "Please provide an argument!",
    // searching in lyrics
    "choose":"Choose a song",
    "timeout":"Timeout",

    // queue
    "queueTitle": "Song Queue",
    "queueBody": "**Now playing**\n[%VAR%](%VAR%)\n\n**Queued Songs**\n%VAR%\n%VAR% songs in queue",

    // related
    "relatedSearch": "🔍 | Searching for related tracks...",
    // noResult in pixiv

    // remove
    "removed": "Removed %VAR%!",
    "invalidInt": "You have to enter a valid integer!",

    // resume
    "playing": "I'm already playing!",
    "resume": "Resumed!",

    // skip
    "skipped": "Skipped the song.",

    // stop
    "stopped": "Stopped playing songs.",

    // n
    "notNSFW": "This is not a nsfw channel!",
    "noNum": "You need to provide a 6 digit number!",

    // nhentai
    "invalidBookID": "The book ID doesn't exist!",

    // set
    "languageNotSupported": "Language not supported!",
    "changeSuccess": "Language changed successfully to `%VAR%`!",
    "argsNotChannel": "Argument not a channel!",
    "argsNotRole": "Argument not a role!",
    "argsNotNumber": "Argument not a number!",
    "noRole": "No role provided!",
    "logChannelChanged": "Changed my log channel to %VAR%!",
    "starboardChanged": "Changed starboard channel to %VAR%!",
    "levelRewardAdded": "Added level reward: %VAR% => %VAR%!",
    "levelRewardRemoved": "Removed level reward: %VAR% => %VAR%!",

    // cemoji
    "noEmoji": "Please specify an emoji to add!",
    "addSuccess": "The emoji `%VAR%` %VAR% was successfully added to the server!",

    // edit-snipe
    "exceed10": "You can't snipe beyond 10!",
    "invalidSnipe": "Not a valid snipe!",
    "noSnipe":"There's nothing to snipe!",

    // snipe
    // exceed10 in edit-snipe
    // invalidSnipe in edit-snipe
    // noSnipe in edit-snipe

    // ping
    "pinging": "Pinging...",
    "heartbeat": "Websocket heartbeat:",
    "latency": "Round trip latency:",

};