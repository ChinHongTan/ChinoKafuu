<h1 align="center">
  <a href="https://github.com/ChinHongTan/ChinoKafuu"><img src="https://media.discordapp.net/attachments/761941062842449944/869577832412631060/71102294_p0.png" alt="banner"></a>
  <br>
  ChinoKafuu
  <br>
  <br>
</h1>

A nice little discord bot I make to learn JavaScript and how bots works XD

The bot is not quite done yet, but I will keep on updating!

And yes, Chino is the best girl in the world!

[![CodeFactor](https://www.codefactor.io/repository/github/chinhongtan/chinokafuu/badge/main)](https://www.codefactor.io/repository/github/chinhongtan/chinokafuu/overview/main)
[![codebeat badge](https://codebeat.co/badges/756b4af6-5758-4bdd-b34b-c312e8f6cf7a)](https://codebeat.co/projects/github-com-chinhongtan-chinokafuu-main)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/3db0f95584064f65acafc9b751c1d042)](https://www.codacy.com/gh/ChinHongTan/ChinoKafuu/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=ChinHongTan/ChinoKafuu&amp;utm_campaign=Badge_Grade)

## Introduction

This bot runs on [`Node.js v16`](https://nodejs.org/) and is built with [`discord.js v13`](https://discord.js.org/#/docs/main/v12/general/welcome).

## Invite link

[Click me to invite the bot!](https://discord.com/api/oauth2/authorize?client_id=958201832528838706&permissions=8&scope=bot%20applications.commands)

## Set up
This project uses node.js v16 to run, so make sure you set up node.js first.

Also, make sure you give the bot `Administrator` permission and has the `applications.commands` application scope enabled.

First you have to clone the project:
```bash
git clone https://github.com/ChinHongTan/ChinoKafuu.git
```
Then you have to install all the npm modules
```bash
cd ChinoKafuu
npm i
```
After that you will need to create a file named "config.json" in the "config" folder.
An example "config.example.json" has been given in the "config" folder.
Here's what you should fill in the config.json:

## Prepare config.json
```json
{
  "prefix": "c!",
  "clientId": "bot's-discord-id",
  "channelId": "ID-of-channel-to-log-errors/messages",
  "guildId": "developer-guild-id-here",
  "token": "discord-bot-token-here",
  "owner_id": "bot-owner's-discord-id",
  "sagiri_token": "saucenao-api-token-here",
  "genius_token": "lyric-api-token-here",
  "mongodb": "database-uri-here",
  "SpotifyClientID": "spotify-client-id",
  "SpotifyClientSecret": "spotify-client-secret",
  "PixivRefreshToken" : "used-to-login-pixiv"
}
```
- prefix: The prefix you want to use to interact with the bot. (Use \<prefix>help for more information.)
- clientId: The discord id of the bot's main server. [How do I get it?](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-)
- channelId: The id of channel for bot to `console.log` output at.
Useful if you are hosting the bot on online platform, and wish to monitor the bot's logs without logging into the online platform.
If the output is too long and exceeds discord's message length limit, the bot will not log anything and not sending any errors at the same time.
Leave blank to make the bot log to terminal instead.
- guildId: Development server's id.
- token: The token needed to get the bot online. [How do I get it?](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token)
- owner_id: Bot owner's id
- sagiri_token: Needed for reverse image searching using [Saucenao](https://saucenao.com/). 
You can get a token by [registering an account](https://saucenao.com/user.php) and going to the API page.
- genius_token: Needed to search for a song's lyrics.[How do I get it?](https://genius.com/developers)
- mongodb: uri to connect to the database. This bot uses MongoDB: [Getting started](https://www.mongodb.com/docs/manual/tutorial/getting-started/)
- SpotifyClientID & SpotifyClientSecret: Needed to get songs from Spotify. [How do I get it?](https://developer.spotify.com/documentation/general/guides/authorization/app-settings/)
- PixivRefreshToken: Needed to log in pixiv. [How do I get it?](https://gist.github.com/ZipFile/c9ebedb224406f4f11845ab700124362)

Note that only `prefix`, `clientId`, `token` and `owner_id` are needed to get the bot online.
The others are just optional features.

Register the commands first:
```bash
node register.js
```

To start the bot:
```bash
npm start
```

**prefix: `c!`**

Use `c!help` for detailed usage and information!

