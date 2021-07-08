# **ChinoKafuu**

A nice little discord bot I make to learn JavaScript and how bots works XD

The bot is not quite done yet but I will keep on updating!

This bot runs on Node.js

## Invite link

[Invite link](https://discord.com/api/oauth2/authorize?client_id=859653069276839967&permissions=8&scope=bot)

## Features

**prefix: `c!`**

-   ### Music Commands
    -   `play [text / link]` -> plays songs from youtube based on text queries/link
    -   `queue` -> displays the current song queue
    -   `skip` -> skips the current playing song
    -   `stop` -> stops playing songs and leaves the channel
    -   `search [text]` -> searches youtube based on text queries
    -   `remove [number]` -> removes a song from the queue
-   ### Images
    -   `sauce [image / link]` -> search saucenao & ascii2d for an image
    -   `anime [image / link]` -> search trace.moe for anime screenshots / scene
    -   `loli` -> sends a loli image xD
-   ### Economy

    ~~not actually useful but who cares~~
    Send a message to earn $1
    -   `balance` -> see how much money you've got
    -   `shop` -> see what's on sale in shop
    -   `buy` -> buys an item from shop
    -   `transfer [@user]` -> gives money to another user
    -   `inventory` -> see what you've got in your bag!
    -   `leaderboard` -> see who's the richest person
-   ### Games

    (\*Join a channel before using this command!)
    -   `betrayal` -> ~~I haven't tried this command too so I don't know what's inside~~
    -   `chess` -> plays chess together
    -   `fishing` -> fish together
    -   `poker` -> plays poker together
    -   `youtube` -> watch youtube together
    -   `draft` -> ~~I don't know why I give it this name~~ plays a simple connect four game
-   ### Server backup

    As the backup files are huge, I am not storing it in database, so all the data will disappear after restarting the bot
    -   `create [max]` -> creates a server backup with max messages per channel
    -   `backup-info [ID]` -> checks a backup info based on its ID
    -   `load [ID]` -> load a backup based on ID **ALL THE CHANGES MADE ARE IRREVERSIBLE**
-   ### Utilities
    -   `avatar [@user]` -> display an user's avatar, do not mention to display self avatar
    -   `beep` -> boop
    -   `cemoji` -> WIP
    -   `covid [country]` -> check covid status of a country
    -   `editsnipe [number]` -> snipe recently edited message [max snipe: 10]
    -   `snipe [snipe]` -> snipe recently deleted message [max snipe: 10]
    -   `help` -> display help message
    -   `ping` -> checks bot latency
    -   `prune [number]` -> bulk deletes [number] messages
    -   `reload` -> \*not working reloads a command
    -   `user-info [@user]` -> display user info
    -   `webhook [message]` -> sends a message using webhook
-   ### NSFW
    -   `n [number]` -> returns nhentai link based on number
    -   `nhentai [number]` -> searches nhentai and watch it in discord xD
    -   `hentai` -> sends a hentai image

## ToDoList

-   [ ] Delete unused codes and functions
-   [ ] Make a language option
-   [ ] Customisable commands and prefixes
-   [ ] Add slash commands
-   [ ] Improved help command
-   [x] Tidy up codes
-   [ ] Add some explaination into code
-   [ ] Group different files into folders
-   [ ] Music command youtube playlist support
-   [ ] Play songs from Spotify & SoundCloud
-   [ ] Save backup data in JSONstorage
-   [ ] Queries Google and Wolfram Alpha for results
-   [ ] Change emoji reactions to buttons
-   [ ] Leveling system
-   [ ] Retrieve osu status
-   [ ] Anti raid system
-   [ ] Moderation system
