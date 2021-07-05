const ytsr = require("ytsr");
const ytdl = require('ytdl-core');

module.exports = {
	name: 'play',
	guildOnly: true,
    musicCommand: true,
	description: 'Play a song based on a given url or a keyword',
    musicCommand: true,
	async execute(client, message, args) {
        const voiceChannel = message.member.voice.channel;
        const permissions = voiceChannel.permissionsFor(message.client.user);
        let serverQueue = client.queue.get(message.guild.id);

        if (!message.member.voice.channel) return message.channel.send("You need to be in a voice channel to play music!");
        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) return message.channel.send("I need the permissions to join and speak in your voice channel!");
        if (!args[0]) return message.channel.send("不要留白拉幹");
    
        if (ytdl.validateURL(args[0])) {
            var link = args[0];
        } else {
            var keyword = message.content.substr(message.content.indexOf(" ") + 1);
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

            try {
                var connection = await voiceChannel.join();
                queueContruct.connection = connection;
                queueContruct.songs.push(song);
                client.queue.set(message.guild.id, queueContruct);
                play(message.guild, queueContruct.songs[0]);
            } catch (err) {
                console.log(err);
                client.queue.delete(message.guild.id);
                message.channel.send(err);
            }
        } else {
            serverQueue.songs.push(song);
            message.channel.send(
                `${song.title} has been added to the queue!`
            );
        }

        function play(guild, song) {
            let serverQueue = client.queue.get(message.guild.id);
            if (!song) {
                serverQueue.voiceChannel.leave();
                client.queue.delete(guild.id);
                return;
            }
            const dispatcher = serverQueue.connection
                .play(ytdl(song.url, { quality: 'highestaudio' }))
                .on("finish", () => {
                    serverQueue.songs.shift();
                    play(guild, serverQueue.songs[0], serverQueue);
                })
                .on("error", (error) => console.error(error));
            dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
            serverQueue.textChannel.send(`Start playing: **${song.title}**`);
        }
	},
};