const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const commandReply = new CommandReply();
function nowplaying(command, language) {
    const queueData = require('../../data/queueData');
    const { queue } = queueData;
    const serverQueue = queue.get(command.guild.id);
    const dispatcher = serverQueue?.connection?.dispatcher;
    const { format } = require('../../functions/musicFunctions');
    const Discord = require('discord.js');
    const progressbar = require('string-progressbar');

    if (!command.member.voice.channel) {
        return commandReply.reply(command, language.notInVC, 'RED');
    }

    if (serverQueue) {
        const song = serverQueue.songs[0];

        const embed = new Discord.MessageEmbed()
            .setColor('#ff0000')
            .setTitle(language.npTitle)
            .setDescription(`[${song.title}](${song.url})\n\`[${format(dispatcher.streamTime / 1000)}/${format(song.duration)}]\`\n${progressbar.splitBar(song.duration, dispatcher.streamTime / 1000, 15)[0]}`)
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
        data: new SlashCommandBuilder()
            .setName('nowplaying')
            .setDescription('Now playing'),
        async execute(interaction, language) {
            nowplaying(interaction, language);
        },
    },
};
