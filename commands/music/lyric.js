const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const commandReply = new CommandReply();
const lyricsFinder = require('lyrics-finder');
const solenolyrics = require('solenolyrics');
const Genius = require('genius-lyrics');
const geniusToken = process.env.GENIUS || require('../../config/config.json').genius_token;
const Client = new Genius.Client(geniusToken);
async function lyric(command, args, language) {
    const { queue } = require('../../data/queueData');
    const serverQueue = queue.get(command.guild.id)

    if (!command.member.voice.channel) {
        return commandReply.reply(command, language.notInVC, 'RED');
    }
    async function searchLyrics(keyword) {
        const msg = await commandReply.reply(command, `:mag: | Searching lyrics for ${keyword}...`, 'BLUE');
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
        if (args[0]) keyword = command.content.substr(command.content.indexOf(' ') + 1);
        await searchLyrics(keyword ?? songTitle);
    }
    else {
        let keyword;
        if (args[0]) keyword = command.content?.substr(command.content?.indexOf(' ') + 1);
        if (keyword) return await searchLyrics(keyword);
        return commandReply.reply(command, language.noSong, 'RED');
    }
}
module.exports = {
    name: 'lyric',
    guildOnly: true,
    aliases: ['ly'],
    description: true,
    async execute(message, args, language) {
        await lyric(message, args, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder()
            .addStringOption((option) => option.setName('keyword').setDescription('Song title to search for lyrics')),
        async execute(interaction, args, language) {
            await lyric(interaction, interaction.options.getString('keyword'), language);
        },
    },
};
