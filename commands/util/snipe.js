const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const commandReply = new CommandReply();
module.exports = {
    name: 'snipe',
    guildOnly: true,
    description: true,
    async execute(message, args, language) {
        const { MessageEmbed } = require('discord.js');
        const collection = message.client.snipeCollection;

        const snipeWithGuild = await collection.findOne({ id: message.guild.id });
        let snipes;

        if (snipeWithGuild) {
            snipes = snipeWithGuild.snipes;
        }
        else {
            return commandReply.reply(message, language.noSnipe, 'RED');
        }
        const arg = args[0] ?? 1;

        if (Number(arg) > 10) return commandReply.reply(message, language.exceed10, 'RED');
        const msg = snipes?.[Number(arg) - 1];
        if (!msg) return commandReply.reply(message, language.invalidSnipe, 'RED');

        const image = msg.attachments;

        const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setAuthor(msg.author, msg.authorAvatar)
            .setDescription(msg.content)
            .setFooter(msg.timestamp)
            .setImage(image);
        return message.channel.send({ embeds: [embed] });
    },
    slashCommand: {
        data: new SlashCommandBuilder()
            .setName('snipe')
            .setDescription('Snipe a message')
            .addIntegerOption((option) => option.setName('number').setDescription('message to snipe')),
        async execute(interaction, language) {
            const { MessageEmbed } = require('discord.js');
            const collection = interaction.client.snipeCollection;

            const snipeWithGuild = await collection.findOne({ id: interaction.guild.id });
            let snipes;

            if (snipeWithGuild) {
                snipes = snipeWithGuild.snipes;
            }
            else {
                return commandReply.reply(interaction, language.noSnipe, 'RED');
            }
            const arg = interaction.options.getInteger('number') ?? 1;

            if (Number(arg) > 10) return commandReply.reply(interaction, language.exceed10, 'RED');
            const msg = snipes?.[Number(arg) - 1];
            if (!msg) return commandReply.reply(interaction, language.invalidSnipe, 'RED');

            const image = msg.attachments;

            const embed = new MessageEmbed()
                .setColor('RANDOM')
                .setAuthor(msg.author, msg.authorAvatar)
                .setDescription(msg.content)
                .setFooter(msg.timestamp)
                .setImage(image);
            return interaction.reply({ embeds: [embed] });
        },
    },
};
