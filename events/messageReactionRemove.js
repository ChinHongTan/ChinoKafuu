const { MessageEmbed } = require('discord.js');
const { searchForStars, extension } = require('../functions/eventFunctions');

module.exports = {
    name: 'messageReactionRemove',
    async execute(reaction, user) {
        if (reaction.partial) await reaction.fetch();
        const { message } = reaction;
        if (message.author.id === user.id) return;
        if (reaction.emoji.name !== '⭐') return;
        const { stars, starChannel } = searchForStars(reaction);
        if (stars) {
            const star = /^⭐\s([0-9]{1,3})\s\|\s([0-9]{17,20})/.exec(stars.embeds[0].footer.text);
            const foundStar = stars.embeds[0];
            const image = message.attachments.size > 0 ? await extension(reaction, message.attachments.first().url) : '';
            const embed = new MessageEmbed()
                .setColor(foundStar.color)
                .setDescription(foundStar.description)
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setTimestamp()
                .setFooter({ text: `⭐ ${parseInt(star[1]) - 1} | ${message.id}` })
                .setImage(image);
            const starMsg = await starChannel.messages.fetch(stars.id);
            await starMsg.edit({ embeds: [embed] });
            if (parseInt(star[1]) - 1 === 0) return setTimeout(() => starMsg.delete(), 1000);
        }
    },
};