module.exports = {
	name: 'detect',
	aliases: ['embed'],
	guildOnly: true,
	description: "Detects embed from bots (useless command)",
	execute(client, message, args) {

        const fs = require('fs');

		message.channel.send('Detect mode activated!')
		// `m` is a message object that will be passed through the filter function
		const filter = m => m.author.bot || !m.author.tag === 'ChinoKafuu#8837';
		const collector = message.channel.createMessageCollector(filter, {idle: 30000});

		collector.on('collect', m => {

			var embedInfo = new Object();
			var embedMessage = [];
			for (let embed of m.embeds) { // these are some of the properties
				try {
					embedMessage.push(`Title: ${embed.title}`)
					embedInfo.title = embed.title;
				} catch (error) {
				};

				try {
					embedMessage.push(`Author: ${embed.author.name}`);
					embedInfo.author = embed.author.name;
				} catch (error) {
				};

				try {
					embedMessage.push(`Description: ${embed.description}`);
					embedInfo.description = embed.description;
				} catch (error) {
				}

				try {
					embedMessage.push(`Footer text: ${embed.footer.text}`);
					embedInfo.footerText = embed.footer.text;
				} catch (error) {
				};

				try {
					embedMessage.push(`Footer icon: ${embed.footer.iconURL}`);
					embedInfo.footerIcon = embed.footer.iconURL;
				} catch (error) {
				};

				try {
					embedMessage.push(`Embed image: ${embed.image.url}`);
					embedInfo.embedIcon = embed.image.url;
				} catch (error) {
				};

				try {
					embedMessage.push(`Provider: ${embed.provider.name}`);
					embedInfo.provider = embed.provider.name;
				} catch (error) {
				};

				try {
					embedMessage.push(`Thumbnail: ${embed.thumbnail.url}`);
					embedInfo.thumbnail = embed.thumbnail.url;
				} catch (error) {
				};

	            embedMessage.push(`Colour: ${embed.hexColor}`);
	            embedInfo.colour = embed.hexColor;
	    		try {
	    		    for (let field of embed.field) {
	      				embedMessage.push(`Field title: ${field.name}\nField value: ${field.value}`);
	      				embedInfo.fieldTitle = field.name;
	      				embedInfo.fieldValue = field.value;
	          		};
	    		} catch (error) {
	    		};

	    	    let data = JSON.stringify(embedInfo);
	            fs.writeFileSync('embedInfo.json', data);
	            m.channel.send(embedMessage.join("\n"));
	        };

	    });

		collector.on('end', collected => {
			message.channel.send(`Detect mode deactivated!\nProcessed ${collected.size} items`);
		});	
	},
};