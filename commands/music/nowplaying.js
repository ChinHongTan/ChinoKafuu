const { reply } = require('../../functions/Util.js');
const { format, checkStats } = require('../../functions/musicFunctions');
const { MessageEmbed } = require('discord.js');
const progressbar = require('string-progressbar');
const { SlashCommandBuilder } = require('@discordjs/builders');
async function nowPlaying(command, language) {
    const serverQueue = await checkStats(command, true);
    if (serverQueue === 'error') return;
    const resource = serverQueue?.resource;

    if (serverQueue) {
        const song = serverQueue.songs[0];

        const embed = new MessageEmbed()
            .setColor('#ff0000')
            .setTitle(language.npTitle)
            .setDescription(`[${song.title}](${song.url})\n\`[${format(resource.playbackDuration / 1000)}/${format(song.duration)}]\`\n${progressbar.splitBar(song.duration, resource.playbackDuration / 1000, 15)[0]}`)
            .setThumbnail(song.thumb)
            .addField(language.requester, `<@!${song.requester}>`)
            .setFooter({ text: language.musicFooter, iconURL: command.client.user.displayAvatarURL() });
        return reply(command, { embeds: [embed] });
    }
}
module.exports = {
    name: 'now-playing',
    guildOnly: true,
    aliases: ['np'],
    data: new SlashCommandBuilder()
        .setName('now-playing')
        .setDescriptionLocalizations({
            'en-US': 'View currently played song.',
            'zh-CN': '查看目前正在播放的歌曲',
            'zh-TW': '查看目前正在播放的歌曲',
        }),
    execute(interaction, language, languageStr) {
        return nowPlaying(interaction, language, languageStr);
    },
};
