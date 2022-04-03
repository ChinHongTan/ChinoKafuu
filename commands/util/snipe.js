const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const commandReply = new CommandReply();
const { MessageEmbed } = require('discord.js');
const fs = require('fs');

async function snipe(command, args, language) {
    const collection = command.client.snipeCollection;

    let snipeWithGuild;
    if (collection) {
        snipeWithGuild = await collection.findOne({ id: command.guild.id });
    }
    else {
        snipeWithGuild = fs.readFileSync('./data/snipes.json');
    }
    let snipes;

    if (snipeWithGuild) {
        snipes = snipeWithGuild.snipes;
    }
    else {
        return commandReply.reply(command, language.noSnipe, 'RED');
    }
    const arg = args[0] ?? 1;

    if (Number(arg) > 10) return commandReply.reply(command, language.exceed10, 'RED');
    const msg = snipes?.[Number(arg) - 1];
    if (!msg) return commandReply.reply(command, language.invalidSnipe, 'RED');

    const image = msg.attachments;

    const embed = new MessageEmbed()
        .setColor('RANDOM')
        .setAuthor(msg.author, msg.authorAvatar)
        .setDescription(msg.content)
        .setFooter(msg.timestamp)
        .setImage(image);
    return commandReply.reply(command, embed);
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
