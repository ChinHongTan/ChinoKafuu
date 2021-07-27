module.exports = {
    name: "storeSnipes",
    func: function (message) {
        const fs = require("fs");
        let data = fs.readFileSync("./data/snipes.json");
        let snipeWithGuild = new Map(JSON.parse(data));
        if (message.author.bot) {return;}
        if (!message.guild) {return;}

        let snipe = {};
        let content = message.content;
        if (!content) {
            content = "None";
        }
        let snipes = (snipeWithGuild.has(message.guild.id)) ? snipeWithGuild.get(message.guild.id) : [];

        snipe.author = message.author.tag;
        snipe.authorAvatar = message.author.displayAvatarURL({
            format: "png",
            dynamic: true,
        });
        snipe.content = message.content;
        snipe.timestamp = message.createdAt.toUTCString([8]);
        snipe.attachments = (message.attachments) ? message.attachments.first().proxyURL : "";

        snipes.unshift(snipe);
        if (snipes.length > 10) {
            snipes.pop();
        }
        snipeWithGuild.set(message.guild.id, snipes);
        data = JSON.stringify(
            Array.from(snipeWithGuild.entries()),
            null,
            2
        );
        fs.writeFileSync("./data/snipes.json", data);
    },
};
