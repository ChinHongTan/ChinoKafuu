const { MessageEmbed } = require('discord.js');
const { extension } = require('../functions/Util.js');

module.exports = {
    name: 'messageReactionAdd',
    async execute(reaction, user) {
        if (reaction.partial) await reaction.fetch();
        const { message } = reaction;
        if (reaction.emoji.name !== '⭐') return;
        if (message.author.id === user.id) return message.channel.send(`${user}不要自己給自己打星啦笑死`);
        if (message.author.bot) return message.channel.send(`${user}不能給機器人打星啦`);
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
                .setDescription(`${message.cleanContent}\n\n[訊息鏈接](${message.url})`)
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setTimestamp(new Date())
                .setFooter({ text: `⭐ 1 | ${message.id}` })
                .setImage(image);
            await starChannel.send({ embeds: [embed] });
        }
    },
};