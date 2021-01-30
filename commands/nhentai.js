module.exports = {
    name: 'nhentai',
    cooldown: 10,
	description: 'Search for a doujin on nhentai.',
	execute(message, args) {
        const nhentai = require('nhentai-js');

        function createHomepageEmbed(homepage, page) {
            let embed = new Discord.MessageEmbed()
            .setTitle(homepage.results[page].title)
            .setDescription(`bookId: ${homepage.results[page].bookId}`)
            .setColor('#ff0000')
            .setImage(homepage.results[page].thumbnail)
            .setFooter('⬅️: Back, ➡️: Forward, ▶️: Book info');
            return embed;
        };

        function createDoujinEmbed(doujin, page) {
            let parodiesInfo = charactersInfo = tagsInfo = groupsInfo = languagesInfo = categoriesInfo = '';
            doujin.details.parodies.forEach(parody => {
                parodiesInfo += `${parody}\n`;
            });
            doujin.details.characters.forEach(character => {
                charactersInfo += `${character}\n`;
            });
            doujin.details.tags.forEach(tag => {
                tagsInfo += `${tag}\n`;
            });
            doujin.details.groups.forEach(group => {
                groupsInfo += `${group}\n`;
            });
            doujin.details.languages.forEach(language => {
                languagesInfo += `${language}\n`;
            });
            doujin.details.categories.forEach(category => {
                categoriesInfo += `${category}\n`;
            });
            let embed = new Discord.MessageEmbed()
            .setTitle(doujin.title)
            .setDescription(`Parodies: ${parodiesInfo}\nCharacters: ${charactersInfo}\nTags: ${tagsInfo}\nGroups: ${groupsInfo}\nLanguages: ${languagesInfo}\nCategories: ${categoriesInfo}`)
            .setColor('#ff0000')
            .setImage(doujin.details.pages[0])
            .addField('Link', doujin.link)
            .setFooter('◀️: Homepage, ▶️: Read the book');
            return embed;
        };

        function createSearchEmbed(result, page) {
            let embed = new Discord.MessageEmbed()
            .setTitle(result.results[page].title)
            .setDescription(`bookId: ${result.results[page].bookId}`)
            .setColor('#ff0000')
            .setImage(result.results[page].thumbnail)
            .setFooter('◀️: Homepage, ⬅️: Back, ➡️: Forward, ▶️: Read the book');
            return embed;
        };

        function createBookEmbed(pages, page) {
            let embed = new Discord.MessageEmbed()
            .setImage(pages[page])
            .setFooter('◀️: Homepage, ⬅️: Back, ➡️: Forward');
            return embed;
        };

        function createHomepageFlip(embed, homepage) {
            message.channel.send(embed).then(embedMessage => {
                embedMessage.react('⬅️')
                .then(embedMessage.react('➡️'))
                .then(embedMessage.react('▶️'));
                const filter = (reaction, user) => ['⬅️', '➡️', '▶️'].includes(reaction.emoji.name) && !user.bot;
                const collector = embedMessage.createReactionCollector(filter, { idle: 600000, dispose: true });
                collector.on('collect', async (r) => {
                    if (r.emoji.name === '⬅️') {
                        page -= 1;
                        if (page < 0) page = homepage.length - 1;
                        var editedEmbed = createHomepageEmbed(homepage, page);
                        embedMessage.edit(editedEmbed);
                    } else if (r.emoji.name === '➡️') {
                        page += 1;
                        if (page + 1 > homepage.length) page = 0;
                        var editedEmbed = createHomepageEmbed(homepage, page);
                        embedMessage.edit(editedEmbed);
                    } else if (r.emoji.name === '▶️') {
                        collector.stop();
                        const doujin = await nhentai.getDoujin(homepage.results[page].bookId);
                        var page = 0;
                        var embed = createDoujinEmbed(doujin, page);
                        createDoujinFlip(embed, doujin);
                    };
                });
                collector.on('remove', r => {
                    if (r.emoji.name === '⬅️') {
                        page -= 1;
                        if (page < 0) page = homepage.length - 1;
                        var editedEmbed = createHomepageEmbed(homepage, page);
                        embedMessage.edit(editedEmbed);
                    } else if (r.emoji.name === '➡️') {
                        page += 1;
                        if (page + 1 > homepage.length) page = 0;
                        var editedEmbed = createHomepageEmbed(homepage, page);
                        embedMessage.edit(editedEmbed);
                    };
                });
            });
        };

        function createDoujinFlip(embed, doujin) {
            message.channel.send(embed).then(embedMessage => {
                embedMessage.react('◀️')
                .then(embedMessage.react('▶️'));
                const filter = (reaction, user) => ['◀️', '▶️'].includes(reaction.emoji.name) && !user.bot;
                const collector = embedMessage.createReactionCollector(filter, { idle: 600000 });
                collector.on('collect', async (r) => {
                    if (r.emoji.name === '▶️') {
                        collector.stop();
                        var page = 0;
                        var embed = createBookEmbed(doujin.details.pages, page);
                        createBookFlip(embed, doujin.details.page);
                    } else if (r.emoji.name === '◀️') {
                        collector.stop();
                        const homepage = await nhentai.getHomepage(1);
                        var page = 0;
                        var embed = createHomepageEmbed(homepage, page);
                        createHomepageFlip(embed, homepage);
                    };
                });
            });
        };

        function createSearchFlip(embed, result) {
            message.channel.send(embed).then(embedMessage => {
                embedMessage.react('◀️')
                .then(embedMessage.react('⬅️'))
                .then(embedMessage.react('➡️'))
                .then(embedMessage.react('▶️'));
                const filter = (reaction, user) => ['◀️', '⬅️', '➡️', '▶️'].includes(reaction.emoji.name) && !user.bot;
                const collector = embedMessage.createReactionCollector(filter, { idle: 600000, dispose: true });
                collector.on('collect', async (r) => {
                    if (r.emoji.name === '⬅️') {
                        page -= 1;
                        if (page < 0) page = result.results.length - 1;
                        var editedEmbed = createSearchEmbed(result, page);
                        embedMessage.edit(editedEmbed);
                    } else if (r.emoji.name === '➡️') {
                        page += 1;
                        if (page + 1 > result.results.length) page = 0;
                        var editedEmbed = createSearchEmbed(result, page);
                        embedMessage.edit(editedEmbed);
                    } else if (r.emoji.name === '◀️') {
                        collector.stop();
                        const homepage = await nhentai.getHomepage(1);
                        var page = 0;
                        var embed = createHomepageEmbed(homepage, page);
                        createHomepageFlip(embed, homepage);
                    } else if (r.emoji.name === '▶️') {
                        collector.stop();
                        const doujin = await nhentai.getDoujin(result.results[page].bookId);
                        var page = 0;
                        var embed = createDoujinEmbed(doujin, page);
                        createDoujinFlip(embed, doujin);
                    };
                });
                collector.on('remove', r => {
                    if (r.emoji.name === '⬅️') {
                        page -= 1;
                        if (page < 0) page = result.results.length - 1;
                        var editedEmbed = createSearchEmbed(result, page);
                        embedMessage.edit(editedEmbed);
                    } else if (r.emoji.name === '➡️') {
                        page += 1;
                        if (page + 1 > result.results.length) page = 0;
                        var editedEmbed = createSearchEmbed(result, page);
                        embedMessage.edit(editedEmbed);
                    };
                });
            });
        };

        function createBookFlip(embed, pages) {
            message.channel.send(embed).then(embedMessage => {
                embedMessage.react('◀️')
                .then(embedMessage.react('⬅️'))
                .then(embedMessage.react('➡️'));
                const filter = (reaction, user) => ['◀️', '⬅️', '➡️'].includes(reaction.emoji.name) && !user.bot;
                const collector = embedMessage.createReactionCollector(filter, { idle: 600000, dispose: true });
                collector.on('collect', async (r) => {
                    if (r.emoji.name === '⬅️') {
                        page -= 1;
                        if (page < 0) page = pages.length - 1;
                        var editedEmbed = createBookEmbed(pages, page);
                        embedMessage.edit(editedEmbed);
                    } else if (r.emoji.name === '➡️') {
                        page += 1;
                        if (page + 1 > pages.length) page = 0;
                        var editedEmbed = createBookEmbed(pages, page);
                        embedMessage.edit(editedEmbed);
                    } else if (r.emoji.name === '◀️') {
                        collector.stop();
                        const homepage = await nhentai.getHomepage(1);
                        var page = 0;
                        var embed = createHomepageEmbed(homepage, page);
                        createHomepageFlip(embed, homepage);
                    };
                });
                collector.on('remove', r => {
                    if (r.emoji.name === '⬅️') {
                        page -= 1;
                        if (page < 0) page = response.length - 1;
                        var editedEmbed = createBookEmbed(pages, page);
                        embedMessage.edit(editedEmbed);
                    } else if (r.emoji.name === '➡️') {
                        page += 1;
                        if (page + 1 > pages.length) page = 0;
                        var editedEmbed = createBookEmbed(pages, page);
                        embedMessage.edit(editedEmbed);
                    };
                });
            });
        }
        
        (async () => {
            if (args.length < 1) {
                const homepage = await nhentai.getHomepage(1);
                var page = 0;
                var embed = createHomepageEmbed(homepage, page);
                createHomepageFlip(embed, homepage);
            } else if (Number(args[0])) {
                if (nhentai.exists(args[0])) {
                    const doujin = await nhentai.getDoujin(args[0]);
                    var page = 0;
                    var embed = createDoujinEmbed(doujin, page);
                    createDoujinFlip(embed, doujin);
                } else {
                    const result = await nhentai.search(message.substring(message.content.indexOf('c!nhentai '), message.content.length));
                    var page = 0;
                    var embed = createSearchEmbed(result, page);
                    createSearchFlip(embed, result);
                };
            };
        })();
	},
};
