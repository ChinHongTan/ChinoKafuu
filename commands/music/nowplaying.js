module.exports = {
    name: "nowplaying",
    guildOnly: true,
    aliases: ["np"],
    description: {"en_US" : "Sees the song currently being played.", "zh_CN" : "查看目前正在播放的歌曲"},
    execute(message, _args, language) {
        const queueData = require("../../data/queueData");
        let queue = queueData.queue;
        let serverQueue = queue.get(message.guild.id);
        let dispatcher = serverQueue.connection.dispatcher;
        const { format } = require("../../functions/musicFunctions");
        const Discord = require("discord.js");
        const progressbar = require('string-progressbar');

        if (serverQueue) {
            var song = serverQueue.songs[0];

            let embed = new Discord.MessageEmbed()
                .setColor("#ff0000")
                .setTitle(language.npTitle)
                .setDescription(`[${song.title}](${song.url})\n\`[${format(dispatcher.streamTime / 1000)}/${format(song.duration)}]\`\n${progressbar.splitBar(song.duration, dispatcher.streamTime / 1000, 15)[0]}`)
                .setThumbnail(song.thumb)
                .addField(language.requester, `<@!${song.requseter}>`)
                .setFooter(language.musicFooter, message.client.user.displayAvatarURL());
            return message.channel.send(embed);
        } else {
            return message.channel.send(language.noSong);
        }
    },
};
