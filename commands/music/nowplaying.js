const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const commandReply = new CommandReply();
const { format } = require('../../functions/musicFunctions');
const { MessageEmbed } = require('discord.js');
const progressbar = require('string-progressbar');
function nowplaying(command, language) {
    const { queue } = require('../../data/queueData');
    const serverQueue = queue.get(command.guild.id);
    const resource = serverQueue?.resource;

    if (!command.member.voice.channel) {
        return commandReply.reply(command, language.notInVC, 'RED');
    }

    if (serverQueue) {
        const song = serverQueue.songs[0];

        const embed = new MessageEmbed()
            .setColor('#ff0000')
            .setTitle(language.npTitle)
            .setDescription(`[${song.title}](${song.url})\n\`[${format(resource.playbackDuration / 1000)}/${format(song.duration)}]\`\n${progressbar.splitBar(song.duration, resource.playbackDuration / 1000, 15)[0]}`)
            .setThumbnail(song.thumb)
            .addField(language.requester, `<@!${song.requseter}>`)
            .setFooter(language.musicFooter, command.client.user.displayAvatarURL());
        return commandReply.reply(command, embed);
    }
    return commandReply.reply(command, language.noSong, 'RED');
}
module.exports = {
    name: 'nowplaying',
    guildOnly: true,
    aliases: ['np'],
    description: true,
    execute(message, _args, language) {
        nowplaying(message, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder(),
        execute(interaction, language) {
            nowplaying(interaction, language);
        },
    },
};
