module.exports = {
    name: "storeEditSnipes",
    func: function (oldMessage, newMessage) {
        const fs = require("fs");
        let rawData = fs.readFileSync("./data/editSnipes.json");
        let editSnipesWithGuild = new Map(JSON.parse(rawData));

        if (oldMessage.author.bot) {
            return;
        }
        if (!oldMessage.guild) {
            return;
        }

        var editSnipe = {};
        let editSnipes = editSnipesWithGuild.get(oldMessage.guild.id) ?? [];

        editSnipe.author = newMessage.author.tag;
        editSnipe.authorAvatar = newMessage.author.displayAvatarURL({
            format: "png",
            dynamic: true,
        });
        editSnipe.content = oldMessage.content;
        if (newMessage.editedAt) {
            editSnipe.timestamp = newMessage.editedAt.toUTCString([8]);
            editSnipes.unshift(editSnipe);
        }
        if (editSnipes.length > 10) {
            editSnipes.pop();
        }
        editSnipesWithGuild.set(oldMessage.guild.id, editSnipes);
        let data = JSON.stringify(
            Array.from(editSnipesWithGuild.entries()),
            null,
            2
        );
        fs.writeFileSync("./data/editSnipes.json", data);
    },
};
