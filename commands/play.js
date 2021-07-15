module.exports = {
    name: "play",
    guildOnly: true,
    aliases: ["p"],
    description: "Play a song based on a given url or a keyword",
    async execute(message, args) {
        const ytsr = require("ytsr");
        const ytdl = require("ytdl-core");
        const queueData = require("../data/queueData");
        let queue = queueData.queue;
        let serverQueue = queue.get(message.guild.id);

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel)
            return message.channel.send(
                "You need to be in a voice channel to play music!"
            );
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
            return message.channel.send(
                "I need the permissions to join and speak in your voice channel!"
            );
        }

        if (ytdl.validateURL(args[0])) {
            var link = args[0];
        } else {
            var keyword = message.content.substr(
                message.content.indexOf(" ") + 1
            );
            message.channel.send(`Searching ${keyword}...`);
            const filters1 = await ytsr.getFilters(keyword);
            const filter1 = filters1.get("Type").get("Video");
            const searchResults = await ytsr(filter1.url, {
                gl: "TW",
                hl: "zh-Hant",
                limit: 1,
            });
            var link = searchResults.items[0].url;
        }
        const songInfo = await ytdl.getInfo(link);
        const song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
            length: songInfo.videoDetails.lengthSeconds,
        };

        if (!serverQueue) {
            const queueContruct = {
                textChannel: message.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 5,
                playing: true,
            };

            queue.set(message.guild.id, queueContruct);

            queueContruct.songs.push(song);

            try {
                var connection = await voiceChannel.join();
                queueContruct.connection = connection;
                play(message.guild, queueContruct.songs[0], queue);
            } catch (err) {
                console.log(err);
                queue.delete(message.guild.id);
            }
        } else {
            serverQueue.songs.push(song);
            message.channel.send(`${song.title} has been added to the queue!`);
        }

        function play(guild, song, queue) {
            const serverQueue = queue.get(guild.id);
            if (!song) {
                serverQueue.voiceChannel.leave();
                queue.delete(guild.id);
                return;
            }

            const dispatcher = serverQueue.connection
                .play(
                    ytdl(song.url, {
                        quality: "highestaudio",
                        highWaterMark: 1 << 25,
                    })
                )
                .on("finish", () => {
                    serverQueue.songs.shift();
                    play(guild, serverQueue.songs[0], queue);
                })
                .on("error", (error) => console.error(error));
            dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
            serverQueue.textChannel.send(`Start playing: **${song.title}**`);
        }
    },
};
