const { SlashCommandBuilder } = require('@discordjs/builders');
const { reply } = require('../../functions/commandReply.js');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');

async function snipe(command, args, language) {
    const collection = command.client.snipeCollection;

    let snipeWithGuild;
    if (collection) {
        snipeWithGuild = await collection.findOne({ id: command.guild.id });
    } else {
        const rawData = fs.readFileSync('./data/snipes.json');
        snipeWithGuild = JSON.parse(rawData);
    }
    let snipes;

    if (snipeWithGuild) {
        snipes = snipeWithGuild.snipes;
    } else {
        return reply(command, language.noSnipe, 'RED');
    }
    const arg = args[0] ?? 1;

    if (Number(arg) > 10) return reply(command, language.exceed10, 'RED');
    const msg = snipes?.[Number(arg) - 1];
    if (!msg) return reply(command, language.invalidSnipe, 'RED');

    const image = msg.attachments;

    const embed = new MessageEmbed()
        .setColor('RANDOM')
        .setAuthor({ name: msg.author, iconURL: msg.authorAvatar })
        .setDescription(msg.content)
        .setTimestamp(msg.timestamp)
        .setImage(image);
    return reply(command, { embeds: [embed] });
}
module.exports = {
    name: 'snipe',
    guildOnly: true,
    description: true,
    async execute(message, args, language) {
        await snipe(message, args, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder()
            .addIntegerOption((option) => option.setName('number').setDescription('message to snipe')),
        async execute(interaction, language) {
            await snipe(interaction, [interaction.options.getInteger('number') ?? 1], language);
        },
    },
};
