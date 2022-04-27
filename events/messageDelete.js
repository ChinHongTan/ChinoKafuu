const { MessageEmbed } = require('discord.js');
const { saveSnipes, getSnipes, getGuildOption } = require('../functions/Util');

module.exports = {
    name: 'messageDelete',
    async execute(message) {
        // can't fetch anything
        if (message.partial) return;
        const snipeWithGuild = await getSnipes(message.client, message.guild.id);
        if (message.author.bot) return;
        if (!message.guild) return;

        const snipe = {};
        const snipes = snipeWithGuild?.snipes ?? [];
        snipe.author = message.author.tag;
        snipe.authorAvatar = message.author.displayAvatarURL({
            format: 'png',
            dynamic: true,
        });
        snipe.content = message.content ?? 'None';
        snipe.timestamp = message.createdAt;
        snipe.attachments = message.attachments.first()?.proxyURL;

        snipes.unshift(snipe);
        if (snipes.length > 10) snipes.pop();
        snipeWithGuild.snipes = snipes;
        await saveSnipes(message.client, snipeWithGuild, message.guild.id);

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

        const guildOption = await getGuildOption(message.client, message.guild.id);
        const logChannelId = guildOption.options.channel;
        if (!logChannelId) return; // log channel not set
        const logChannel = await message.guild.channels.fetch(guildOption.options.channel);
        if (!logChannel) return;
        return logChannel.send({ embeds: [logEmbed] });
    },
};
