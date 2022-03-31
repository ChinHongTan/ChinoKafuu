const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const commandReply = new CommandReply();
const { MessageEmbed } = require('discord.js');

function hentai(command, _args, language) {
    const fs = require('fs');
    if (!command.channel.nsfw) {
        return commandReply.reply(command, language.notNSFW, 'RED');
    }

    const imageFiles = fs
        .readdirSync('./images')
        .filter((file) => file.endsWith('.json'));
    const pictures = {};

    for (const filename of imageFiles) {
        const rawdata = fs.readFileSync(`./images/${filename}`);
        const imagefile = JSON.parse(rawdata);

        pictures[filename] = imagefile;
    }

    const nsfw = ['發圖區（18r）.json', 'vtuber18r區域.json'];
    let random = Math.floor(Math.random() * nsfw.length);
    const targetFile = nsfw[random];
    const pic = pictures[targetFile];
    random = Math.floor(Math.random() * pic.length);
    const images = pic[random];
    const { messageurl } = images;
    random = Math.floor(Math.random() * images.attachments.length);
    const imageInfo = images.attachments[random];
    const embed = new MessageEmbed()
        .setColor('#2d9af8')
        .setTitle('死变态！')
        .setDescription(language.loliProvider.replace('${images.author}', images.author).replace('${messageurl}', messageurl))
        .setImage(imageInfo.url)
        .setFooter(
            '蘿莉控的FBI避難所',
            'https://cdn.discordapp.com/icons/764839074228994069/5be3f532073fdae6a9d934e1c6f6a2b5.png?size=2048',
        );
    return commandReply.reply(command, embed);
};

module.exports = {
    name: 'hentai',
    cooldown: 3,
    description: true,
    execute(message, _args, language) {
        hentai(message, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder(),
        async execute(interaction, language) {
            hentai(interaction, language);
        }
    }
};
