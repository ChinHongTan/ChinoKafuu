const { SlashCommandBuilder } = require('@discordjs/builders');

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
            if (Number(arg) > 10) {
                return message.channel.send({
                    embeds:
                [{
                    description: language.exceed10,
                    color: 'RED',
                }],
                });
            }
            const msg = editsnipes?.[Number(arg) - 1];
            if (!msg) {
                return message.channel.send({
                    embeds:
                [{
                    description: language.invalidSnipe,
                    color: 'RED',
                }],
                });
            }
            const embed = new MessageEmbed()
                .setColor('RANDOM')
                .setAuthor(msg.author, msg.authorAvatar)
                .setDescription(msg.content)
                .setFooter(msg.timestamp);
            return message.channel.send({ embeds: [embed] });
        }
        return message.channel.send({
            embeds:
                [{
                    description: language.noSnipe,
                    color: 'RED',
                }],
        });
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
                if (Number(arg) > 10) {
                    return interaction.reply({
                        embeds:
                    [{
                        description: language.exceed10,
                        color: 'RED',
                    }],
                    });
                }
                const msg = editsnipes?.[Number(arg) - 1];
                if (!msg) {
                    return interaction.reply({
                        embeds:
                    [{
                        description: language.invalidSnipe,
                        color: 'RED',
                    }],
                    });
                }
                const embed = new MessageEmbed()
                    .setColor('RANDOM')
                    .setAuthor(msg.author, msg.authorAvatar)
                    .setDescription(msg.content)
                    .setFooter(msg.timestamp);
                return interaction.reply({ embeds: [embed] });
            }
            return interaction.reply({
                embeds:
                    [{
                        description: language.noSnipe,
                        color: 'RED',
                    }],
            });
        },
    },
};
