const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const commandReply = new CommandReply();
const { format, checkStats } = require('../../functions/musicFunctions');
const { MessageEmbed } = require('discord.js');
const progressbar = require('string-progressbar');
function nowPlaying(command, language) {
    const serverQueue = checkStats(command, language, true);
    const resource = serverQueue?.resource;

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
}
module.exports = {
    name: 'nowPlaying',
    guildOnly: true,
    aliases: ['np'],
    description: true,
    async execute(message, _args, language) {
        await nowPlaying(message, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder(),
        async execute(interaction, language) {
            await nowPlaying(interaction, language);
        },
    },
};
