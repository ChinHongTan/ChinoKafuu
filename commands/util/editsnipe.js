const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const commandReply = new CommandReply();
module.exports = {
    name: 'editsnipe',
    aliases: ['esnipe'],
    guildOnly: true,
    description: true,
    async execute(message, args, language) {
        const { MessageEmbed } = require('discord.js');
        const collection = message.client.editSnipeCollection;

        const editSnipesWithGuild = await collection.findOne({ id: message.guild.id });
        const arg = args[0] ?? 1;

        if (editSnipesWithGuild) {
            const editsnipes = editSnipesWithGuild.editSnipe;
            if (Number(arg) > 10) return commandReply.reply(message, language.exceed10, 'RED');
            const msg = editsnipes?.[Number(arg) - 1];
            if (!msg) return commandReply.reply(message, language.invalidSnipe, 'RED');
            const embed = new MessageEmbed()
                .setColor('RANDOM')
                .setAuthor(msg.author, msg.authorAvatar)
                .setDescription(msg.content)
                .setFooter(msg.timestamp);
            return message.channel.send({ embeds: [embed] });
        }
        return commandReply.reply(message, language.noSnipe, 'RED');
    },
    slashCommand: {
        data: new SlashCommandBuilder()
            .setName('editsnipe')
            .setDescription('Snipe an edited message')
            .addIntegerOption((option) => option.setName('number').setDescription('message to snipe')),
        async execute(interaction, language) {
            const { MessageEmbed } = require('discord.js');
            const collection = interaction.client.editSnipeCollection;

            const editSnipesWithGuild = await collection.findOne({ id: interaction.guild.id });
            const arg = interaction.options.getInteger('number') ?? 1;

            if (editSnipesWithGuild) {
                const editsnipes = editSnipesWithGuild.editSnipe;
                if (Number(arg) > 10) return commandReply.reply(interaction, language.exceed10, 'RED');
                const msg = editsnipes?.[Number(arg) - 1];
                if (!msg) return commandReply.reply(interaction, language.invalidSnipe, 'RED');
                const embed = new MessageEmbed()
                    .setColor('RANDOM')
                    .setAuthor(msg.author, msg.authorAvatar)
                    .setDescription(msg.content)
                    .setFooter(msg.timestamp);
                return interaction.reply({ embeds: [embed] });
            }
            return commandReply.reply(interaction, language.noSnipe, 'RED');
        },
    },
};
