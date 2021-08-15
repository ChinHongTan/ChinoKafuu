module.exports = {
    name: "remove",
    guildOnly: true,
    aliases: ["r"],
    description: true,
    execute(message, args, language) {
        const queueData = require("../../data/queueData");
        let queue = queueData.queue;
        let serverQueue = queue.get(message.guild.id);
        if (!message.member.voice.channel) {
            return message.channel.send(language.notInVC);
        }

        if (serverQueue) {
            args.forEach((number) => {
                let queuenum = Number(number);
                if (Number.isInteger(queuenum) && queuenum <= serverQueue.songs.length && queuenum > 0) {
                    message.channel.send(language.removed.replace("${serverQueue.songs[queuenum].title}", serverQueue.songs[queuenum].title));
                    serverQueue.songs.splice(queuenum, 1);
                } else {
                    message.channel.send(language.invalidInt);
                }
            });
        } else {
            return message.channel.send(language.noSong);
        }
    },
};
