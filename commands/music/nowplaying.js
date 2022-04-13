const { SlashCommandBuilder } = require('@discordjs/builders');
const { reply } = require('../../functions/commandReply.js');
const { format, checkStats } = require('../../functions/musicFunctions');
const { MessageEmbed } = require('discord.js');
const progressbar = require('string-progressbar');
async function nowPlaying(command, language) {
    const serverQueue = await checkStats(command, language, true);
    if (serverQueue === 'error') return;
    const resource = serverQueue?.resource;

    if (serverQueue) {
        const song = serverQueue.songs[0];

        const embed = new MessageEmbed()
            .setColor('#ff0000')
            .setTitle(language.npTitle)
            .setDescription(`[${song.title}](${song.url})\n\`[${format(resource.playbackDuration / 1000)}/${format(song.duration)}]\`\n${progressbar.splitBar(song.duration, resource.playbackDuration / 1000, 15)[0]}`)
            .setThumbnail(song.thumb)
            .addField(language.requester, `<@!${song.requseter}>`)
            .setFooter({ text: language.musicFooter, iconURL: command.client.user.displayAvatarURL() });
        return reply(command, { embeds: [embed] });
    }
}
module.exports = {
    name: 'nowplaying',
    guildOnly: true,
    aliases: ['np'],
    description: true,
    execute(message, _args, language) {
        return nowPlaying(message, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder(),
        execute(interaction, language) {
            return nowPlaying(interaction, language);
        },
    },
};
