module.exports = {
    name: "hentai",
    cooldown: 3,
    description: "get a 18r picture",
    execute(message) {
        const fs = require("fs");
        const Discord = require("discord.js");

        if (!message.channel.nsfw)
            return message.channel.send("This is not a nsfw channel!");

        const imageFiles = fs
            .readdirSync("./images")
            .filter((file) => file.endsWith(".json"));
        pictures = new Object();

        for (const filename of imageFiles) {
            let rawdata = fs.readFileSync(`./images/${filename}`);
            let imagefile = JSON.parse(rawdata);

            pictures[filename] = imagefile;
        }

        const nsfw = ["發圖區（18r）.json", "vtuber18r區域.json"];
        let random = Math.floor(Math.random() * nsfw.length);
        let targetFile = nsfw[random];
        let pic = pictures[targetFile];
        let random = Math.floor(Math.random() * pic.length);
        let images = pic[random];
        let messageurl = images.messageurl;
        let random = Math.floor(Math.random() * images.attachments.length);
        let imageInfo = images.attachments[random];
        let embed = new Discord.MessageEmbed()
            .setColor("#2d9af8")
            .setTitle(`蘿莉圖！`)
            .setDescription(
                `來源商：${images.author}\n[圖片鏈接](${messageurl})`
            )
            .setImage(imageInfo.url)
            .setFooter(
                `蘿莉控的FBI避難所`,
                "https://cdn.discordapp.com/icons/764839074228994069/5be3f532073fdae6a9d934e1c6f6a2b5.png?size=2048"
            );
        message.channel.send(embed);
        fs.writeFileSync(`../data/` + filename, data);
    },
};
