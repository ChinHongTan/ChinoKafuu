"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Function to update embed message after a user had reacted
 * @param {MessageReaction} r - Reaction from the user
 * @param {number} page - Which result to be displayed
 * @param {object[]} itemList - The result from the API.
 * @param {Message} embedMessage - Discord message with an embed.
 * @param {function} createEmbed - Function to create embed.
 * @param {ReactionCollector} collector - Discord reaction collector.
 * @param {function} collectorFunc - Function after stopping the collector.
 * @param {any[]} collectorParams - parameters for collector function.
 * @returns {number} Page
 */
function updateEmbed(r, page, itemList, embedMessage, createEmbed, collector, collectorFunc, collectorParams) {
    let editedEmbed;
    switch (r.emoji.name) {
        case "⬅️":
            page -= 1;
            if (page < 0)
                page = itemList.length - 1;
            itemList["page"] = page;
            itemList["total"] = itemList.length;
            editedEmbed = createEmbed(itemList[page]);
            embedMessage.edit({ embeds: [editedEmbed] });
            if (collectorParams && collectorParams.length > 1) {
                collectorParams[1] = page;
            }
            break;
        case "➡️":
            page += 1;
            if (page + 1 > itemList.length)
                page = 0;
            itemList["page"] = page;
            itemList["total"] = itemList.length;
            editedEmbed = createEmbed(itemList[page]);
            embedMessage.edit({ embeds: [editedEmbed] });
            if (collectorParams && collectorParams.length > 1) {
                collectorParams[1] = page;
            }
            break;
        case "▶️":
            collector.stop();
            collectorFunc(...collectorParams);
            embedMessage.delete();
            break;
    }
    return page;
}
class DynamicEmbed {
    /**
     * Creates and sends a reactable message
     * @param {Message} message - Message that initiated this function
     * @param {object[]} itemList - Result from API call
     * @param {string[]} emojiList - Emoji used to control dynamic embed
     * @param {function} createEmbed - Function to create embed
     * @param {function} collectorFunc - Function to tell what is the next thing to do after receiving an emoji
     * @param {any[]} collectorParams - collectorFunc's params
     */
    async createEmbedFlip(message, itemList, emojiList, createEmbed, collectorFunc, collectorParams) {
        let page = 0;
        if (typeof itemList[page] === "object") {
            itemList["page"] = page;
            itemList["total"] = itemList.length;
        }
        let embed = createEmbed(itemList[page]);
        let embedMessage = await message.channel.send({ embeds: [embed] });
        for (let emoji of emojiList) {
            await embedMessage.react(emoji);
        }
        const filter = (reaction, user) => emojiList.includes(reaction.emoji.name) && !user.bot;
        const collector = embedMessage.createReactionCollector({
            filter,
            idle: 600000,
            dispose: true,
        });
        collector.on("collect", (r) => {
            page = updateEmbed(r, page, itemList, embedMessage, createEmbed, collector, collectorFunc, collectorParams);
        });
        collector.on("remove", (r) => {
            page = updateEmbed(r, page, itemList, embedMessage, createEmbed, collector, collectorFunc, collectorParams);
        });
    }
}
module.exports = DynamicEmbed;
//# sourceMappingURL=dynamicEmbed.js.map