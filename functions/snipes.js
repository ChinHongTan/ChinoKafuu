module.exports = {
    name: 'storeSnipes',
    func: function (message) {
        const fs = require("fs");
        const Discord = require("Discord.js");
        let data = fs.readFileSync("./snipes.json");
        let snipeWithGuild = new Map(JSON.parse(data));
        if (message.author.bot) return;
        if (!message.guild) return;

        var snipe = new Object();
        var content = message.content;
        if (!content) content = "None";
        if (snipeWithGuild.has(message.guild.id)) {
            snipes = snipeWithGuild.get(message.guild.id);
        } else {
            var snipes = [];
        }

        snipe.author = message.author.tag;
        snipe.authorAvatar = message.author.displayAvatarURL({
            format: "png",
            dynamic: true,
        });
        snipe.content = message.content;
        snipe.timestamp = message.createdAt.toUTCString([8]);

        if (
            message.attachments.size > 0 &&
            message.guild.id === "764839074228994069"
        ) {
            const channel = message.client.channels.cache.get("764846009221251122");
            var urlArray = [];
            message.attachments.each((attachment) => {
                urlArray.push(attachment.proxyURL);
            });
            snipe.attachments = urlArray;
            urlArray.forEach((url) => {
                let embed = new Discord.MessageEmbed()
                    .setColor("#ffff00")
                    .setTitle(`**__Message Delete__**`)
                    .addFields(
                        {
                            name: "**User**",
                            value: `${message.author.tag}`,
                            inline: true,
                        },
                        {
                            name: "**Channel**",
                            value: `${message.channel}`,
                            inline: true,
                        },
                        { name: "**Content**", value: `${content}` }
                    )
                    .setImage(url);
                channel.send(embed);
            });
            snipes.unshift(snipe);
            if (snipes.length > 10) snipes.pop();
            snipeWithGuild.set(message.guild.id, snipes);
            let data = JSON.stringify(
                Array.from(snipeWithGuild.entries()),
                null,
                2
            );
            fs.writeFileSync(`./snipes.json`, data);
        } else {
            snipes.unshift(snipe);
            if (snipes.length > 10) snipes.pop();
            snipeWithGuild.set(message.guild.id, snipes);
            let data = JSON.stringify(
                Array.from(snipeWithGuild.entries()),
                null,
                2
            );
            fs.writeFileSync(`./snipes.json`, data);
        };
    },
};
