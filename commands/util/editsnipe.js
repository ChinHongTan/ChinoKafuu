const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
    name: "editsnipe",
    aliases: ["esnipe"],
    guildOnly: true,
    description: true,
    async execute(message, args, language) {
        const { MessageEmbed } = require("discord.js");
        const collection = message.client.editSnipeCollection;

        let editSnipesWithGuild = await collection.findOne({ id: message.guild.id });
        let arg = args[0] ?? 1;

        if (editSnipesWithGuild) {
            let editsnipes = editSnipesWithGuild.editSnipe;
            if (Number(arg) > 10) return message.channel.send({embeds: 
                [{
                    description: language.exceed10,
                    color: "RED"
                }]
            });
            let msg = editsnipes?.[Number(arg) - 1];
            if (!msg) return message.channel.send({embeds: 
                [{
                    description: language.invalidSnipe,
                    color: "RED"
                }]
            });
            let embed = new MessageEmbed()
                .setColor("RANDOM")
                .setAuthor(msg.author, msg.authorAvatar)
                .setDescription(msg.content)
                .setFooter(msg.timestamp);
            return message.channel.send({embeds: [embed]});
        } else {
            return message.channel.send({embeds: 
                [{
                    description: language.noSnipe,
                    color: "RED"
                }]
            });
        }
    },
    slashCommand: {
        data: new SlashCommandBuilder()
            .setName("editsnipe")
            .setDescription("Snipe an edited message")
            .addIntegerOption(option => option.setName("number").setDescription("message to snipe")),
        async execute(interaction, language) {
            const { MessageEmbed } = require("discord.js");
            const collection = interaction.client.editSnipeCollection;
    
            let editSnipesWithGuild = await collection.findOne({ id: interaction.guild.id });
            let arg = interaction.options.getInteger('number') ?? 1;
    
            if (editSnipesWithGuild) {
                let editsnipes = editSnipesWithGuild.editSnipe;
                if (Number(arg) > 10) return interaction.reply({embeds: 
                    [{
                        description: language.exceed10,
                        color: "RED"
                    }]
                });
                let msg = editsnipes?.[Number(arg) - 1];
                if (!msg) return interaction.reply({embeds: 
                    [{
                        description: language.invalidSnipe,
                        color: "RED"
                    }]
                });
                let embed = new MessageEmbed()
                    .setColor("RANDOM")
                    .setAuthor(msg.author, msg.authorAvatar)
                    .setDescription(msg.content)
                    .setFooter(msg.timestamp);
                return interaction.reply({embeds: [embed]});
            } else {
                return interaction.reply({embeds: 
                    [{
                        description: language.noSnipe,
                        color: "RED"
                    }]
                });
            }
        },
    }
};
