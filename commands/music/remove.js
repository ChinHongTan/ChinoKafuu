module.exports = {
    name: "remove",
    guildOnly: true,
    aliases: ["r"],
    description: "Removes a song from the queue",
    execute(message, args) {
        const queueData = require("../../data/queueData");
        let queue = queueData.queue;
        let serverQueue = queue.get(message.guild.id);

        if (serverQueue) {
            args.forEach((number) => {
                let queuenum = Number(number);
                if (Number.isInteger(queuenum) && queuenum <= serverQueue.songs.length && queuenum > 0) {
                    message.channel.send(`Removed ${serverQueue.songs[queuenum].title}!`);
                    serverQueue.songs.splice(queuenum, 1);
                } else {
                    message.channel.send("You have to enter a valid integer!");
                }
            });
        }
    },
};
