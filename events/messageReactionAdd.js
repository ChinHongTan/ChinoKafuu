const { MessageEmbed } = require('discord.js');
const { searchForStars, extension } = require('../functions/eventFunctions');

module.exports = {
    name: 'messageReactionAdd',
    async execute(reaction, user) {
        if (reaction.partial) await reaction.fetch();
        const { message } = reaction;
        if (reaction.emoji.name !== '⭐') return;
        if (message.author.id === user.id) return message.channel.send(`${user}, you cannot star your own messages.`);
        if (message.author.bot) return message.channel.send(`${user}, you cannot star bot messages.`);
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
                .setFooter({ text: `⭐ ${parseInt(star[1]) + 1} | ${message.id}` })
                .setImage(image);
            const starMsg = await starChannel.messages.fetch(stars.id);
            await starMsg.edit({ embeds: [embed] });
        }
        if (!stars) {
            const image = message.attachments.size > 0 ? await extension(reaction, message.attachments.first().url) : '';
            if (image === '' && message.cleanContent.length < 1) return message.channel.send(`${user}, you cannot star an empty message.`);
            const embed = new MessageEmbed()
                .setColor(15844367)
                .setDescription(`${message.cleanContent}\n\n[Jump to message!](${message.url})`)
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setTimestamp(new Date())
                .setFooter({ text: `⭐ 1 | ${message.id}` })
                .setImage(image);
            await starChannel.send({ embeds: [embed] });
        }
    },
};