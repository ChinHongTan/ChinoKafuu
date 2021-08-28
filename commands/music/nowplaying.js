module.exports = {
    name: 'nowplaying',
    guildOnly: true,
    aliases: ['np'],
    description: true,
    execute(message, _args, language) {
        const queueData = require('../../data/queueData');
        const { queue } = queueData;
        const serverQueue = queue.get(message.guild.id);
        const dispatcher = serverQueue?.connection?.dispatcher;
        const { format } = require('../../functions/musicFunctions');
        const Discord = require('discord.js');
        const progressbar = require('string-progressbar');

        if (!message.member.voice.channel) {
            return message.channel.send(language.notInVC);
        }

        if (serverQueue) {
            const song = serverQueue.songs[0];

            const embed = new Discord.MessageEmbed()
                .setColor('#ff0000')
                .setTitle(language.npTitle)
                .setDescription(`[${song.title}](${song.url})\n\`[${format(dispatcher.streamTime / 1000)}/${format(song.duration)}]\`\n${progressbar.splitBar(song.duration, dispatcher.streamTime / 1000, 15)[0]}`)
                .setThumbnail(song.thumb)
                .addField(language.requester, `<@!${song.requseter}>`)
                .setFooter(language.musicFooter, message.client.user.displayAvatarURL());
            return message.channel.send(embed);
        }
        return message.channel.send(language.noSong);
    },
};
