const fs = require('fs');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'messageUpdate',
    async execute(oldMessage, newMessage) {
        if (!newMessage.guild) return;
        if (oldMessage.partial) oldMessage.fetch();
        if (newMessage.partial) newMessage.fetch();
        const collection = newMessage.client.editSnipeCollection;
        let rawData;
        if (collection) {
            rawData = await collection.findOne({ id: newMessage.guild.id });
        } else {
            const buffer = fs.readFileSync('./data/editSnipes.json', 'utf-8');
            const parsedJSON = JSON.parse(buffer);
            rawData = parsedJSON[newMessage.guild.id];
        }
        const editSnipeWithGuild = rawData ?? { id: newMessage.guild.id };

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
        if (collection) {
            const query = { id: newMessage.guild.id };
            const options = { upsert: true };
            await collection.replaceOne(query, editSnipeWithGuild, options);
        } else {
            fs.writeFileSync('./data/editSnipes.json', JSON.stringify(editSnipeWithGuild));
        }

        const optionCollection = newMessage.client.guildOptions;
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

        let guildOption;
        if (optionCollection) {
            guildOption = await optionCollection.findOne({ id: oldMessage.guild.id });
        } else {
            const guildCollection = JSON.parse(fs.readFileSync('./data/guildOption.json', 'utf-8'));
            guildOption = guildCollection[oldMessage.guild.id];
        }
        const logChannel = await newMessage.guild.channels.fetch(guildOption.options.channel);
        if (!logChannel) return;
        return logChannel.send({ embeds: [logEmbed] });
    },
};
