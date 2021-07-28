module.exports = {
    name: "nowplaying",
    guildOnly: true,
    aliases: ["np"],
    description: "Sees the song currently being played.",
    execute(message) {
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
                .setTitle("**Now playing ♪**")
                .setDescription(`[${song.title}](${song.url})\n\`[${format(dispatcher.streamTime / 1000)}/${format(song.duration)}]\`\n${progressbar.splitBar(song.duration, dispatcher.streamTime / 1000, 15)[0]}`)
                .setThumbnail(song.thumb)
                .addField("Requested by:", `<@!${song.requseter}>`)
                .setFooter("音樂系統", message.client.user.displayAvatarURL());
            return message.channel.send(embed);
        } else {
            return message.channel.send("There is no song in the queue!");
        }
    },
};
