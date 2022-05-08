const { MessageEmbed } = require('discord.js');
const { extension } = require('../functions/Util.js');

module.exports = {
    name: 'messageReactionRemove',
    async execute(reaction, user) {
        if (reaction.partial) await reaction.fetch();
        const { message } = reaction;
        if (message.author.id === user.id) return;
        if (reaction.emoji.name !== '⭐') return;
        const starChannel = message.guild.channels.cache.find(channel => channel.id === reaction.client.guildCollection.get(reaction.message.guild.id).data.starboard);
        if (!starChannel) message.channel.send('你還沒有設置starboard喲小可愛');
        const fetchedMessages = await starChannel.messages.fetch({ limit: 100 });
        const stars = fetchedMessages.filter((m) => m.embeds.length !== 0).find(m => m?.embeds[0]?.footer?.text?.startsWith('⭐') && m?.embeds[0]?.footer?.text?.endsWith(message.id));
        if (stars) {
            const star = /^⭐\s(\d{1,3})\s\|\s(\d{17,20})/.exec(stars.embeds[0].footer.text);
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