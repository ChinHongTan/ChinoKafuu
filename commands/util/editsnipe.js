const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const commandReply = new CommandReply();
const { MessageEmbed } = require('discord.js');
const fs = require('fs');

async function esnipe(command, args, language) {
    const collection = command.client.editSnipeCollection;

    let editSnipesWithGuild;
    if (collection) editSnipesWithGuild = await collection.findOne({ id: command.guild.id });
    else {
        const rawData = fs.readFileSync('./data/editsnipes.json');
        editSnipesWithGuild = JSON.parse(rawData);
    }
    const arg = args[0] ?? 1;

    if (editSnipesWithGuild) {
        const editsnipes = editSnipesWithGuild.editSnipe;
        if (Number(arg) > 10) return commandReply.reply(command, language.exceed10, 'RED');
        const msg = editsnipes?.[Number(arg) - 1];
        if (!msg) return commandReply.reply(command, language.invalidSnipe, 'RED');
        const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setAuthor(msg.author, msg.authorAvatar)
            .setDescription(msg.content)
            .setFooter(msg.timestamp);
        return commandReply.reply(command, embed);
    }
    return commandReply.reply(command, language.noSnipe, 'RED');
}
module.exports = {
    name: 'editsnipe',
    aliases: ['esnipe'],
    guildOnly: true,
    description: true,
    async execute(message, args, language) {
        esnipe(message, args, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder()
            .addIntegerOption((option) => option.setName('number').setDescription('message to snipe')),
        async execute(interaction, language) {
            esnipe(interaction, [interaction.options.getInteger('number') ?? 1], language);
        },
    },
};
