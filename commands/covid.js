module.exports = {
    name: "covid",
    description: "Latest global/country covid status!",
    execute(message, args) {
        const Discord = require("discord.js");
        const api = require("novelcovid");
        api.settings({
            baseUrl: "https://disease.sh",
        });

        function createEmbed(result) {
            const date = new Date(result.updated);
            const embed = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setTitle(
                    `**${result.country} COVID-19 data**`
                )
                .setAuthor(
                    "ChinoKafuu",
                    "https://cdn.discordapp.com/avatars/781328218753859635/af716f0a9958679bdb17edfc0add53a6.png?size=256"
                )
                .addFields(
                    {
                        name: "Total cases",
                        value: result.cases.toLocaleString(),
                        inline: true,
                    },
                    {
                        name: "Confirmed today",
                        value: result.todayCases.toLocaleString(),
                        inline: true,
                    },
                    {
                        name: "Total deaths",
                        value: result.deaths.toLocaleString(),
                        inline: true,
                    },
                    {
                        name: "Deaths today",
                        value: result.todayDeaths.toLocaleString(),
                        inline: true,
                    },
                    {
                        name: "Total recovered",
                        value: result.recovered.toLocaleString(),
                        inline: true,
                    },
                    {
                        name: "Recovered today",
                        value: result.todayRecovered.toLocaleString(),
                        inline: true,
                    },
                    {
                        name: "Active cases",
                        value: result.active.toLocaleString(),
                        inline: true,
                    },
                    {
                        name: "Critical cases",
                        value: result.critical.toLocaleString(),
                        inline: true,
                    },
                    {
                        name: "Population",
                        value: result.population.toLocaleString(),
                        inline: true,
                    }
                )
                .setThumbnail(result.countryInfo.flag)
                .setFooter(
                    `Requested by: ${
                        message.author.tag
                    }\nData updated: ${date.toUTCString()}`,
                    message.author.avatarURL()
                );
            return embed;
        }

        function updateEmbed(r, page, result) {
            if (r.emoji.name === "⬅️") {
                page -= 1;
                if (page < 0) page = result.length - 1;
                let editedEmbed = createEmbed(result[page]);
                embedMessage.edit(editedEmbed);
            } else if (r.emoji.name === "➡️") {
                page += 1;
                if (page + 1 > result.length) page = 0;
                let editedEmbed = createEmbed(result[page]);
                embedMessage.edit(editedEmbed);
            }
        }

        function createEmbedFlip(result) {
            let page = 0;
            let embed = createEmbed(result[page]);
            message.channel.send(embed).then((embedMessage) => {
                embedMessage
                    .react("⬅️")
                    .then(embedMessage.react("➡️"));
                const filter = (reaction, user) =>
                    ["⬅️", "➡️"].includes(reaction.emoji.name) &&
                    !user.bot;
                const collector =
                    embedMessage.createReactionCollector(filter, {
                        idle: 60000,
                        dispose: true,
                    });
                collector.on("collect", (r) => {
                    updateEmbed(r, page, result);
                });
                collector.on("remove", (r) => {
                    updateEmbed(r, page, result);
                });
            });
        }

        if (args.length < 1) {
            message.channel.send("Please provide a valid argument!");
            return message.channel.send(
                "eg: `c!covid all` or `c!covid countries`"
            );
        }

        if (args[0] === "all") {
            // get global covid data
            api.all({ allowNull: false }).then((result) => {
                result.country = "Global";
                let embed = createEmbed(result);
                return message.channel.send(embed);
            });
        }

        if (args[0] === "countries") {
            if (args.length == 1) {
                // get a list of data of all countries sorted by cases
                api.countries({ sort: "cases", allowNull: false }).then(
                    (result) => {
                        createEmbedFlip(result);
                    }
                );
            }
        } else {
            if (args.length > 1) {
                // get a list of data of multiple specific countries
                api.countries({ country: args, allowNull: false }).then(
                    (result) => {
                        createEmbedFlip(result);
                    }
                );
            } else {
                // get a list of data of a single specific countries
                api.countries({ country: args, allowNull: false }).then(
                    (result) => {
                        let embed = createEmbed(result);
                        return message.channel.send(embed);
                    }
                );
            }
        }
    },
};
