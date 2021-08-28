module.exports = {
    name: 'lyric',
    guildOnly: true,
    aliases: ['ly'],
    description: 'Loop the currently played song!',
    async execute(message, args, language) {
        const queueData = require('../../data/queueData');
        const { queue } = queueData;
        const serverQueue = queue.get(message.guild.id);
        const lyricsFinder = require('lyrics-finder');
        const solenolyrics = require('solenolyrics');
        const Genius = require('genius-lyrics');
        const geniusToken = process.env.GENIUS || require('../../config/config.json').genius_token;
        const Client = new Genius.Client(geniusToken);

        if (!message.member.voice.channel) {
            return message.channel.send(language.notInVC);
        }
        async function searchLyrics(keyword) {
            const msg = await message.channel.send({
                embed: {
                    description: `:mag: | Searching lyrics for ${keyword}...`,
                    color: 'BLUE',
                },
            });
            let lyrics;
            lyrics = await lyricsFinder(keyword).catch((err) => console.error(err));
            if (!lyrics) lyrics = await solenolyrics.requestLyricsFor(encodeURIComponent(keyword));
            if (!lyrics) {
                const searches = await Client.songs.search(keyword);
                if (searches) lyrics = await searches[0].lyrics().catch((err) => console.log(err));
            }
            if (!lyrics) {
                return msg.edit({
                    embed: {
                        title: 'ERROR!',
                        description: `:x: | No lyrics found for \`${keyword}\`!`,
                        color: 'RED',
                    },
                });
            }
            msg.edit({
                embed: {
                    title: `Lyric for \`${keyword}\``,
                    description: lyrics,
                    color: 'YELLOW',
                },
            });
        }

        if (serverQueue) {
            const songTitle = serverQueue.songs[0].title;
            let keyword;
            if (args[0]) keyword = message.content.substr(message.content.indexOf(' ') + 1);
            await searchLyrics(keyword ?? songTitle);
        }
        else {
            let keyword;
            if (args[0]) keyword = message.content?.substr(message.content?.indexOf(' ') + 1);
            if (keyword) return await searchLyrics(keyword);
            return message.channel.send(language.noSong);
        }
    },
};
