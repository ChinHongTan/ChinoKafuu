const { MessageEmbed } = require('discord.js');
const { getGuildOption, getEditSnipes, saveEditSnipes } = require('../functions/Util');

module.exports = {
    name: 'messageUpdate',
    async execute(oldMessage, newMessage) {
        if (!newMessage.guild) return;
        if (oldMessage.partial) oldMessage.fetch();
        if (newMessage.partial) newMessage.fetch();
        const editSnipeWithGuild = await getEditSnipes(newMessage.client, newMessage.guild.id);

        if (newMessage.author.bot) return;
        if (!newMessage.guild) return;

        const editSnipe = {};
        const editSnipes = editSnipeWithGuild?.editSnipe ?? [];

        editSnipe.author = newMessage.author.tag;
        editSnipe.authorAvatar = newMessage.author.displayAvatarURL({
            format: 'png',
            dynamic: true,
        });
        editSnipe.content = oldMessage.content ?? 'None';
        if (newMessage.editedAt) {
            editSnipe.timestamp = newMessage.editedAt;
            editSnipes.unshift(editSnipe);
        }
        if (editSnipes.length > 10) editSnipes.pop();
        editSnipeWithGuild.editSnipe = editSnipes;
        await saveEditSnipes(newMessage.client, editSnipeWithGuild, newMessage.guild.id);

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

        const guildOption = await getGuildOption(newMessage.client, newMessage.guild.id);
        const logChannelId = guildOption.options.channel;
        if (!logChannelId) return; // log channel not set
        const logChannel = await newMessage.guild.channels.fetch(logChannelId);
        if (!logChannel) return;
        return logChannel.send({ embeds: [logEmbed] });
    },
};
