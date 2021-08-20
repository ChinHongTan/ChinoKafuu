<h1 align="center">
  <a href="https://github.com/ChinHongTan/ChinoKafuu"><img src="https://media.discordapp.net/attachments/761941062842449944/869577832412631060/71102294_p0.png" avtar_c_icon"></a>
  <br>
  ChinoKafuu
  <br>
  <br>
</h1>

**The bot is now being translated into TypeScript! As I am new to TypeScript, you can expect me to upload very slowly in the following couple weeks. Bug fixing rate will also be affected, sorry for the inconvenience!**

A nice little discord bot I make to learn JavaScript and how bots works XD

The bot is not quite done yet but I will keep on updating!

And yes, Chino is the best girl in the world!

[![CodeFactor](https://www.codefactor.io/repository/github/chinhongtan/chinokafuu/badge/main)](https://www.codefactor.io/repository/github/chinhongtan/chinokafuu/overview/main)
[![codebeat badge](https://codebeat.co/badges/756b4af6-5758-4bdd-b34b-c312e8f6cf7a)](https://codebeat.co/projects/github-com-chinhongtan-chinokafuu-main)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/3db0f95584064f65acafc9b751c1d042)](https://www.codacy.com/gh/ChinHongTan/ChinoKafuu/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=ChinHongTan/ChinoKafuu&amp;utm_campaign=Badge_Grade)


## Introduction

This bot runs on [`Node.js v14`](https://nodejs.org/) and is built with [`discord.js v12`](https://discord.js.org/#/docs/main/v12/general/welcome).

## Invite link

[Click me to invite the bot!](https://discord.com/api/oauth2/authorize?client_id=859653069276839967&permissions=8&scope=bot)

## Features

**prefix: `c!`**

Use `c!help` for detailed usage!

-   ### Music Commands
```
    -   play [text / link] -> plays songs from youtube based on text queries/link
    -   queue -> displays the current song queue
    -   skip-> skips the current playing song
    -   stop -> stops playing songs and leaves the channel
    -   search [text] -> searches youtube based on text queries
    -   remove [number] -> removes a song from the queue
```
-   ### Images
```
    -   sauce [image / link] -> search saucenao & ascii2d for an image
    -   anime [image / link] -> search trace.moe for anime screenshots / scene
    -   loli -> sends a loli image xD
```
-   ### Economy

    ~~not actually useful but who cares~~
    Send a message to earn $1
```
    -   balance -> see how much money you've got
    -   shop -> see what's on sale in shop
    -   buy -> buys an item from shop
    -   transfer [@user] -> gives money to another user
    -   inventory -> see what you've got in your bag!
    -   leaderboard -> see who's the richest person
```
-   ### Games
```
    -   youtube -> watch youtube together (\*Join a channel before using this command!)
    -   game ->  plays a simple connect four game
```
-   ### Server backup

As the backup files are huge, I am not storing it in database, so all the data will disappear after restarting the bot
```
    -   create [max] -> creates a server backup with max messages per channel
    -   backup-info [ID] -> checks a backup info based on its ID
    -   load [ID] -> load a backup based on ID **ALL THE CHANGES MADE ARE IRREVERSIBLE**
```
-   ### Utilities
```
    -   avatar [@user] -> display an user's avatar, do not mention to display self avatar
    -   beep -> boop
    -   cemoji -> copies an emoji to the current server
    -   covid [country] -> check covid status of a country
    -   editsnipe [number] -> snipe recently edited message [max snipe: 10]
    -   snipe [snipe] -> snipe recently deleted message [max snipe: 10]
    -   help -> display help message
    -   ping -> checks bot latency
    -   prune [number] -> bulk deletes [number] messages
    -   reload -> reloads a command
    -   user-info [@user] -> display user info
    -   webhook [message]` -> sends a message using webhook
```
-   ### NSFW
```
    -   n [ID] -> returns nhentai link based on the ID
    -   nhentai [number] -> searches nhentai and watch it in discord xD
    -   hentai -> sends a hentai image
```


## ToDoList

-   [x] Delete unused codes and functions
-   [x] Make a language option
-   [ ] Customisable commands and prefixes
-   [ ] Add slash commands
-   [x] Improved help command
-   [x] Tidy up codes
-   [x] Add some explaination into code
-   [x] Group different files into folders
-   [x] Music command youtube playlist support
-   [x] Play songs from Spotify & SoundCloud
-   [ ] Save backup data in JSONstorage
-   [ ] Queries Google and Wolfram Alpha for results
-   [ ] Change emoji reactions to buttons
-   [ ] Leveling system
-   [ ] Retrieve osu status
-   [ ] Anti raid system
-   [ ] Moderation system
