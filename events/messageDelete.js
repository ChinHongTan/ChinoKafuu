const fs = require('fs');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'messageDelete',
    async execute(message) {
        // can't fetch anything
        if (message.partial) return;
        const collection = message.client.snipeCollection;
        let rawData;
        if (collection) {
            rawData = await collection.findOne({ id: message.guild.id });
        } else {
            const buffer = fs.readFileSync('./data/snipes.json', 'utf-8');
            const parsedJSON = JSON.parse(buffer);
            rawData = parsedJSON[message.guild.id];
        }
        const snipeWithGuild = rawData ?? { id: message.guild.id };
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
        if (collection) {
            const query = { id: message.guild.id };
            const options = { upsert: true };
            await collection.replaceOne(query, snipeWithGuild, options);
        } else {
            fs.writeFileSync('./data/snipes.json', JSON.stringify(snipeWithGuild));
        }

        const optionCollection = message.client.guildOptions;
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

        let guildOption;
        if (optionCollection) {
            guildOption = await optionCollection.findOne({ id: message.guild.id });
        } else {
            const guildCollection = JSON.parse(fs.readFileSync('./data/guildOption.json', 'utf-8'));
            guildOption = guildCollection[message.guild.id];
        }
        const logChannel = await message.guild.channels.fetch(guildOption.options.channel);
        if (!logChannel) return;
        return logChannel.send({ embeds: [logEmbed] });
    },
};
