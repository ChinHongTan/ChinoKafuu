const { MessageEmbed } = require('discord.js');
const { saveGuildData } = require('../functions/Util');

module.exports = {
    name: 'messageUpdate',
    async execute(oldMessage, newMessage) {
        if (!newMessage.guild || newMessage.author.bot) return;
        if (oldMessage.partial) await oldMessage.fetch();
        if (newMessage.partial) await newMessage.fetch();
        const guildData = newMessage.client.guildCollection.get(newMessage.guild.id);

        const editSnipe = {};
        const editSnipes = guildData.data.editSnipes;

        editSnipe.author = newMessage.author.tag;
        editSnipe.authorAvatar = newMessage.author.displayAvatarURL({
            format: 'png',
            dynamic: true,
        });
        editSnipe.content = oldMessage?.content ?? 'None';
        editSnipe.timestamp = newMessage?.editedAt ?? Date.now(); // set time stamp to whenever this event is called
        editSnipe.attachments = oldMessage.attachments.first()?.proxyURL;
        editSnipes.unshift(editSnipe);
        if (editSnipes.length > 10) editSnipes.pop();
        await saveGuildData(newMessage.client, newMessage.guild.id);

        const logEmbed = new MessageEmbed()
            .setTitle('**Message deleted**')
            .setDescription('A message was deleted.')
            .setColor('YELLOW')
            .addFields([
                {
                    name: '**Member**',
                    value: `${newMessage.author}\n${newMessage.author.id}`,
                    inline: true,
                },
                {
                    name: '**Channel**',
                    value: `${newMessage.channel}\n${newMessage.channel.id}`,
                    inline: true,
                },
                {
                    name: '**Previous**',
                    value: oldMessage.content ? `\`\`\`${oldMessage.content}\`\`\`` : '*Content could not be recovered*',
                },
                {
                    name: '**Updated**',
                    value: `\`\`\`${newMessage.content}\`\`\``,
                },
            ]);
        const logChannelId = guildData.data.channel;
        if (!logChannelId) return; // log channel not set
        const logChannel = await newMessage.guild.channels.fetch(logChannelId);
        if (!logChannel) return;
        return logChannel.send({ embeds: [logEmbed] });
    },
};
