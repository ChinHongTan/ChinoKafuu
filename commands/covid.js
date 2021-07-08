module.exports = {
    name: "covid",
    description: "Latest global/country covid status!",
    execute(message, args) {
        const Discord = require("discord.js");
        const api = require("novelcovid");
        api.settings({
            baseUrl: "https://disease.sh",
        });

        function createEmbed(result, page) {
            const date = new Date(result[page].updated);
            const embed = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setTitle(
                    `**${result[page].country} COVID-19 data  #${page + 1}**`
                )
                .setAuthor(
                    "ChinoKafuu",
                    "https://cdn.discordapp.com/avatars/781328218753859635/af716f0a9958679bdb17edfc0add53a6.png?size=256"
                )
                .addFields(
                    {
                        name: "Total cases",
                        value: result[page].cases.toLocaleString(),
                        inline: true,
                    },
                    {
                        name: "Confirmed today",
                        value: result[page].todayCases.toLocaleString(),
                        inline: true,
                    },
                    {
                        name: "Total deaths",
                        value: result[page].deaths.toLocaleString(),
                        inline: true,
                    },
                    {
                        name: "Deaths today",
                        value: result[page].todayDeaths.toLocaleString(),
                        inline: true,
                    },
                    {
                        name: "Total recovered",
                        value: result[page].recovered.toLocaleString(),
                        inline: true,
                    },
                    {
                        name: "Recovered today",
                        value: result[page].todayRecovered.toLocaleString(),
                        inline: true,
                    },
                    {
                        name: "Active cases",
                        value: result[page].active.toLocaleString(),
                        inline: true,
                    },
                    {
                        name: "Critical cases",
                        value: result[page].critical.toLocaleString(),
                        inline: true,
                    },
                    {
                        name: "Population",
                        value: result[page].population.toLocaleString(),
                        inline: true,
                    }
                )
                .setThumbnail(result[page].countryInfo.flag)
                .setFooter(
                    `Requested by: ${
                        message.author.tag
                    }\nData updated: ${date.toUTCString()}`,
                    message.author.avatarURL()
                );
            return embed;
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
                console.log(result);
                const date = new Date(result.updated);
                const embed = new Discord.MessageEmbed()
                    .setColor("RANDOM")
                    .setTitle("**Global COVID-19 data**")
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
                    .setFooter(
                        `Requested by: ${
                            message.author.tag
                        }\nData updated: ${date.toUTCString()}`,
                        message.author.avatarURL()
                    );
                return message.channel.send(embed);
            });
        }

        if (args[0] === "countries") {
            if (args.length == 1) {
                // get a list of data of all countries sorted by cases
                api.countries({ sort: "cases", allowNull: false }).then(
                    (result) => {
                        console.log(result);
                        var page = 0;
                        let embed = createEmbed(result, page);
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
                                if (r.emoji.name === "⬅️") {
                                    page -= 1;
                                    if (page < 0) page = result.length - 1;
                                    var editedEmbed = createEmbed(result, page);
                                    embedMessage.edit(editedEmbed);
                                } else if (r.emoji.name === "➡️") {
                                    page += 1;
                                    if (page + 1 > result.length) page = 0;
                                    var editedEmbed = createEmbed(result, page);
                                    embedMessage.edit(editedEmbed);
                                }
                            });
                            collector.on("remove", (r) => {
                                if (r.emoji.name === "⬅️") {
                                    page -= 1;
                                    if (page < 0) page = result.length - 1;
                                    var editedEmbed = createEmbed(result, page);
                                    embedMessage.edit(editedEmbed);
                                } else if (r.emoji.name === "➡️") {
                                    page += 1;
                                    if (page + 1 > result.length) page = 0;
                                    var editedEmbed = createEmbed(result, page);
                                    embedMessage.edit(editedEmbed);
                                }
                            });
                        });
                    }
                );
            }
        } else {
            if (args.length > 1) {
                // get a list of data of multiple specific countries
                api.countries({ country: args, allowNull: false }).then(
                    (result) => {
                        console.log(result);
                        var page = 0;
                        let embed = createEmbed(result, page);
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
                                if (r.emoji.name === "⬅️") {
                                    page -= 1;
                                    if (page < 0) page = result.length - 1;
                                    var editedEmbed = createEmbed(result, page);
                                    embedMessage.edit(editedEmbed);
                                } else if (r.emoji.name === "➡️") {
                                    page += 1;
                                    if (page + 1 > result.length) page = 0;
                                    var editedEmbed = createEmbed(result, page);
                                    embedMessage.edit(editedEmbed);
                                }
                            });
                            collector.on("remove", (r) => {
                                if (r.emoji.name === "⬅️") {
                                    page -= 1;
                                    if (page < 0) page = result.length - 1;
                                    var editedEmbed = createEmbed(result, page);
                                    embedMessage.edit(editedEmbed);
                                } else if (r.emoji.name === "➡️") {
                                    page += 1;
                                    if (page + 1 > result.length) page = 0;
                                    var editedEmbed = createEmbed(result, page);
                                    embedMessage.edit(editedEmbed);
                                }
                            });
                        });
                    }
                );
            } else {
                // get a list of data of a single specific countries
                api.countries({ country: args, allowNull: false }).then(
                    (result) => {
                        console.log(result);
                        const date = new Date(result.updated);
                        const embed = new Discord.MessageEmbed()
                            .setColor("RANDOM")
                            .setTitle(`**${result.country} COVID-19 data**`)
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
                        return message.channel.send(embed);
                    }
                );
            }
        }
    },
};
