module.exports = {
    name: 'nhentai',
    cooldown: 10,
	description: 'Search for a doujin on nhentai.',
	execute(message, args) {
        const nhentai = require('nhentai-js');
		const Discord = require('discord.js');
		const nanaApi = require('nana-api');
		const nana = new nanaApi();

        function createHomepageEmbed(g, homepage, page) {
            let embed = new Discord.MessageEmbed()
            .setTitle(homepage.results[page].title)
            .setDescription(`bookId: ${homepage.results[page].bookId}`)
            .setColor('#ff0000')
            .setImage(g.results[page].thumbnail.s)
            .setFooter('⬅️: Back, ➡️: Forward, ▶️: Book info');
            return embed;
        };

        function createDoujinEmbed(doujin) {
			var description = '';
            for (const [key, value] of Object.entries(doujin.details)) {
				var info = '';
		    	value.forEach(element => {
			    	info += `${element}  `;
				});
				description += `${key}: ${info}`;
			};
            let embed = new Discord.MessageEmbed()
            .setTitle(doujin.title)
            .setDescription(`${description}`)
            .setColor('#ff0000')
            .setImage(doujin.thumbnails[0])
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

        function createHomepageFlip(embed, homepage, g) {
			var page = 0;
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
                        var editedEmbed = createHomepageEmbed(g, homepage, page);
                        embedMessage.edit(editedEmbed);
                    } else if (r.emoji.name === '➡️') {
                        page += 1;
                        if (page + 1 > homepage.length) page = 0;
                        var editedEmbed = createHomepageEmbed(g, homepage, page);
                        embedMessage.edit(editedEmbed);
                    } else if (r.emoji.name === '▶️') {
                        collector.stop();
                        const doujin = await nhentai.getDoujin(homepage.results[page].bookId);
                        var page = 0;
                        var embed = createDoujinEmbed(doujin);
                        createDoujinFlip(embed, doujin);
                    };
                });
                collector.on('remove', r => {
                    if (r.emoji.name === '⬅️') {
                        page -= 1;
                        if (page < 0) page = homepage.length - 1;
                        var editedEmbed = createHomepageEmbed(g, homepage, page);
                        embedMessage.edit(editedEmbed);
                    } else if (r.emoji.name === '➡️') {
                        page += 1;
                        if (page + 1 > homepage.length) page = 0;
                        var editedEmbed = createHomepageEmbed(g, homepage, page);
                        embedMessage.edit(editedEmbed);
                    };
                });
            });
        };

        function createDoujinFlip(embed, doujin) {
			var page = 0;
            message.channel.send(embed).then(embedMessage => {
                embedMessage.react('◀️')
                .then(embedMessage.react('▶️'));
                const filter = (reaction, user) => ['◀️', '▶️'].includes(reaction.emoji.name) && !user.bot;
                const collector = embedMessage.createReactionCollector(filter, { idle: 600000 });
                collector.on('collect', async (r) => {
                    if (r.emoji.name === '▶️') {
                        collector.stop();
                        var page = 0;
                        var embed = createBookEmbed(doujin.pages, page);
                        createBookFlip(embed, doujin.pages);
                    } else if (r.emoji.name === '◀️') {
                        collector.stop();
                        const homepage = await nhentai.getHomepage(1);
						const g = await nana.homepage(1);
                        var page = 0;
                        var embed = createHomepageEmbed(g, homepage, page);
                        createHomepageFlip(embed, homepage, g);
                    };
                });
            });
        };

        function createSearchFlip(embed, result) {
			var page = 0;
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
						const g = await nana.homepage(1);
                        var page = 0;
                        var embed = createHomepageEmbed(g, homepage, page);
                        createHomepageFlip(embed, homepage, g);
                    } else if (r.emoji.name === '▶️') {
                        collector.stop();
                        const doujin = await nhentai.getDoujin(result.results[page].bookId);
                        var page = 0;
                        var embed = createDoujinEmbed(doujin);
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
			var page = 0;
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
						const g = await nana.homepage(1);
                        var page = 0;
                        var embed = createHomepageEmbed(g, homepage, page);
                        createHomepageFlip(embed, homepage, g);
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
				const g = await nana.homepage(1);
                var page = 0;
                var embed = createHomepageEmbed(g, homepage, page);
                createHomepageFlip(embed, homepage, g);
            } else if (Number(args[0])) {
                if (nhentai.exists(args[0])) {
                    const doujin = await nhentai.getDoujin(args[0]);
                    var page = 0;
                    var embed = createDoujinEmbed(doujin);
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
