module.exports = {
    name: 'covid',
    description: true,
    async execute(message, args, language) {
        const Discord = require('discord.js');
        const api = require('novelcovid');
        api.settings({
            baseUrl: 'https://disease.sh',
        });
        const DynamicEmbed = require('../../functions/dynamicEmbed');
        const dynamicEmbed = new DynamicEmbed();

        /**
         * Create an Discord embed message
         * @param {object} result - The result from the API.
         * @return {Discord.MessageEmbed} Discord embed
         */
        function createEmbed(result) {
            const date = new Date(result.updated);
            return new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setTitle(language.covidTitle.replace('${result.country}', result.country))
                .setAuthor(
                    'ChinoKafuu',
                    'https://cdn.discordapp.com/avatars/781328218753859635/af716f0a9958679bdb17edfc0add53a6.png?size=256',
                )
                .addFields(
                    {
                        name: language.totalCases,
                        value: result.cases.toLocaleString(),
                        inline: true,
                    },
                    {
                        name: language.confirmedToday,
                        value: result.todayCases.toLocaleString(),
                        inline: true,
                    },
                    {
                        name: language.totalDeaths,
                        value: result.deaths.toLocaleString(),
                        inline: true,
                    },
                    {
                        name: language.deathsToday,
                        value: result.todayDeaths.toLocaleString(),
                        inline: true,
                    },
                    {
                        name: language.totalRecovered,
                        value: result.recovered.toLocaleString(),
                        inline: true,
                    },
                    {
                        name: language.recoveredToday,
                        value: result.todayRecovered.toLocaleString(),
                        inline: true,
                    },
                    {
                        name: language.activeCases,
                        value: result.active.toLocaleString(),
                        inline: true,
                    },
                    {
                        name: language.criticalCases,
                        value: result.critical.toLocaleString(),
                        inline: true,
                    },
                    {
                        name: language.population,
                        value: result.population.toLocaleString(),
                        inline: true,
                    },
                )
                .setThumbnail(result.countryInfo?.flag)
                .setFooter(
                    language.covidFooter.replace('${message.author.tag}', message.author.tag).replace('${date.toUTCString()}', date.toUTCString()),
                    message.author.avatarURL(),
                );
        }

        if (args.length < 1) {
            // no arguments were provided
            message.channel.send(language.invalidArgument);
            return message.channel.send(language.covidExample);
        }
        if (args[0] === 'global') {
            // get global covid data
            const result = await api.all({ allowNull: false });
            result.country = 'Global';
            const embed = createEmbed(result);
            return message.channel.send(embed);
        }
        if (args[0] === 'countries') {
            // get a list of data of all countries sorted by cases
            const result = await api.countries({ sort: 'cases', allowNull: false });
            return dynamicEmbed.createEmbedFlip(message, result, ['⬅️', '➡️'], createEmbed);
        }
        if (args.length > 1) {
            // get a list of data of multiple specific countries
            const result = await api.countries({ country: args, allowNull: false });
            return dynamicEmbed.createEmbedFlip(message, result, ['⬅️', '➡️'], createEmbed);
        }
        // get a list of data of a single specific countries
        const result = await api.countries({ country: args, allowNull: false });
        const embed = createEmbed(result);
        return message.channel.send(embed);
    },
};
