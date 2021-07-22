const Discord = require("discord.js");
class DynamicEmbed {
    constructor(createEmbed) {
        this.createEmbed = createEmbed;
    }
}
/**
 * Create an Discord embed message
 * @param {object} result - The result from the API.
 * @returns {object} Discord embed
 */
function createEmbed(smallChunk) {
    let printQueue = "";
    smallChunk.forEach((item) => {
        var songNo = item.index;
        var songTitle = item.title;
        var songURL = item.url;
        var songLength = item.duration;
        var queueString = `${songNo}.[${songTitle}](${songURL}) | ${format(
            songLength
        )}\n\n`;
        printQueue += queueString;
    });
    let embed = new Discord.MessageEmbed()
        .setColor("#ff0000")
        .setTitle("Song Queue")
        .setDescription(
            `**Now playing**\n[${serverQueue.songs[0].title}](${serverQueue.songs[0].url})\n\n**Queued Songs**\n${printQueue}${serverQueue.songs.length - 1} songs in queue`
        );
    return embed;
}

/**
 * Function to update embed message after a user had reacted
 * @param {object} r - Reaction from the user
 * @param {number} page - Which result to be displayed
 * @param {object} result - The result from the API.
 * @param {object} embedMessage - Discord embed message.
 * @returns {number} Page
 */
function updateEmbed(r, page, arrayChunk, embedMessage) {
    let editedEmbed;
    switch (r.emoji.name) {
        case "⬅️":
            page -= 1;
            if (page < 0) page = arrayChunk.length - 1;
            editedEmbed = createEmbed(arrayChunk[page]);
            embedMessage.edit(editedEmbed);
            break;
        case "➡️":
            page += 1;
            if (page + 1 > arrayChunk.length) page = 0;
            editedEmbed = createEmbed(arrayChunk[page]);
            embedMessage.edit(editedEmbed);
            break;
    }
    return page;
}

/**
* Creates and sends a reactable message
* @param {object} result - The result from the API.
*/
function createEmbedFlip(arrayChunk) {
    let page = 0;
    let embed = createEmbed(arrayChunk[page]);
    message.channel.send(embed).then((embedMessage) => {
        embedMessage.react("⬅️").then(embedMessage.react("➡️"));
        const filter = (reaction, user) =>
            ["⬅️", "➡️"].includes(reaction.emoji.name) && !user.bot;
        const collector = embedMessage.createReactionCollector(filter, {
            idle: 60000,
            dispose: true,
        });
        collector.on("collect", (r) => {
            page = updateEmbed(r, page, arrayChunk, embedMessage);
        });
        collector.on("remove", (r) => {
            page = updateEmbed(r, page, arrayChunk, embedMessage);
        });
    });
}