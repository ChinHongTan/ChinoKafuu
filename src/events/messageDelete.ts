import { BaseGuildTextChannel, MessageEmbed } from 'discord.js';
import { CustomMessage, Snipe } from '../../typings';
import { saveGuildData } from '../functions/Util';

module.exports = {
    name: 'messageDelete',
    async execute(message: CustomMessage) {
        // can't fetch anything
        if (message.partial || message.author.bot || !message.guild) return;
        const guildData = message.client.guildCollection.get(message.guild.id);

        const snipe: Snipe = {
            author: '',
            authorAvatar: '',
            content: '',
            timestamp: undefined
        };
        const snipes = guildData.data.snipes;
        snipe.author = message.author.tag;
        snipe.authorAvatar = message.author.displayAvatarURL({
            format: 'png',
            dynamic: true,
        });
        snipe.content = message?.content ?? 'None';
        snipe.timestamp = message.createdAt;
        snipe.attachment = message.attachments.first()?.proxyURL;

        snipes.unshift(snipe);
        if (snipes.length > 10) snipes.pop();
        await saveGuildData(message.client, message.guild.id);

        const logEmbed = new MessageEmbed()
            .setTitle('**Message deleted**')
            .setDescription('A message was deleted.')
            .setColor('YELLOW')
            .addFields([
                {
                    name: '**Member**',
                    value: `${message.author}\n${message.author.id}`,
                    inline: true,
                },
                {
                    name: '**Channel**',
                    value: `${message.channel}\n${message.channel.id}`,
                    inline: true,
                },
                {
                    name: '**Content**',
                    value: `\`\`\`${message.content}\`\`\``,
                },
            ]);
        const logChannelId = guildData.data.channel;
        if (!logChannelId) return; // log channel not set
        const logChannel = await message.guild.channels.fetch(logChannelId);
        if (!logChannel || !(logChannel instanceof BaseGuildTextChannel)) return;
        return logChannel.send({ embeds: [logEmbed] });
    },
};
