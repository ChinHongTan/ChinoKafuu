const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
    name: "snipe",
    guildOnly: true,
    description: true,
    async execute(message, args, language) {
        const { MessageEmbed } = require("discord.js");
        const collection = message.client.snipeCollection;

        let snipeWithGuild = await collection.findOne({ id: message.guild.id });
        let snipes;

        if (snipeWithGuild) {
            snipes = snipeWithGuild.snipes;
        } else {
            return message.channel.send({embeds: 
                [{
                    description: language.noSnipe,
                    color: "RED"
                }]
            });
        }
        let arg = args[0] ?? 1;

        if (Number(arg) > 10) return message.channel.send({embeds: 
            [{
                description: language.exceed10,
                color: "RED"
            }]
        });
        let msg = snipes?.[Number(arg) - 1];
        if (!msg) return message.channel.send({embeds: 
            [{
                description: language.invalidSnipe,
                color: "RED"
            }]
        });

        let image = msg.attachments;

        let embed = new MessageEmbed()
            .setColor("RANDOM")
            .setAuthor(msg.author, msg.authorAvatar)
            .setDescription(msg.content)
            .setFooter(msg.timestamp)
            .setImage(image);
        return message.channel.send({embeds: [embed]});
    },
    slashCommand: {
        data: new SlashCommandBuilder()
            .setName("snipe")
            .setDescription("Snipe a message")
            .addIntegerOption(option => option.setName("number").setDescription("message to snipe")),
        async execute(interaction, language) {
            const { MessageEmbed } = require("discord.js");
            const collection = interaction.client.snipeCollection;

            let snipeWithGuild = await collection.findOne({ id: interaction.guild.id });
            let snipes;

            if (snipeWithGuild) {
                snipes = snipeWithGuild.snipes;
            } else {
                return interaction.reply({embeds: 
                    [{
                        description: language.noSnipe,
                        color: "RED"
                    }]
                });
            }
            let arg = interaction.options.getInteger('number') ?? 1;

            if (Number(arg) > 10) return interaction.reply({embeds: 
                [{
                    description: language.exceed10,
                    color: "RED"
                }]
            });
            let msg = snipes?.[Number(arg) - 1];
            if (!msg) return interaction.reply({embeds: 
                [{
                    description: language.invalidSnipe,
                    color: "RED"
                }]
            });

            let image = msg.attachments;

            let embed = new MessageEmbed()
                .setColor("RANDOM")
                .setAuthor(msg.author, msg.authorAvatar)
                .setDescription(msg.content)
                .setFooter(msg.timestamp)
                .setImage(image);
            return interaction.reply({embeds: [embed]});
        },
    },
};
