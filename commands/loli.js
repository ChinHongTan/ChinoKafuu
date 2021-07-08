module.exports = {
    name: "loli",
    cooldown: 3,
    description: "get a picture of a loli",
    execute(message) {
        const fs = require("fs");
        const Discord = require("discord.js");

        const imageFiles = fs
            .readdirSync("./images")
            .filter((file) => file.endsWith(".json"));
        pictures = new Object();

        for (const filename of imageFiles) {
            let rawdata = fs.readFileSync(`./images/${filename}`);
            let imagefile = JSON.parse(rawdata);

            pictures[filename] = imagefile;
        }

        const loli = ["蘿莉圖.json"];
        var random = Math.floor(Math.random() * loli.length);
        var targetFile = loli[random];
        var pic = pictures[targetFile];
        var random = Math.floor(Math.random() * pic.length);
        var images = pic[random];
        var messageurl = images.messageurl;
        var random = Math.floor(Math.random() * images.attachments.length);
        var imageInfo = images.attachments[random];
        let embed = new Discord.MessageEmbed()
            .setColor("#2d9af8")
            .setTitle("蘿莉圖！")
            .setDescription(
                `來源商：${images.author}\n[圖片鏈接](${messageurl})`
            )
            .setImage(imageInfo.url)
            .setFooter(
                "蘿莉控的FBI避難所",
                "https://cdn.discordapp.com/icons/764839074228994069/5be3f532073fdae6a9d934e1c6f6a2b5.png?size=2048"
            );
        message.channel.send(embed);
        fs.writeFileSync(`./` + filename, data);
    },
};
