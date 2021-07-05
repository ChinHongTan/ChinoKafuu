module.exports = {
    name: 'sendWelcomeMessage',
    func: async function(member) {
        const Discord = require('discord.js');
        const Canvas = require('canvas');

        const applyText = (canvas, text) => {
            const context = canvas.getContext("2d");
            let fontSize = 70;
        
            do {
                context.font = `${(fontSize -= 10)}px sans-serif`;
            } while (context.measureText(text).width > canvas.width - 300);
        
            return context.font;
        };

        const channel = member.guild.channels.cache.find(
            (ch) => ch.name === "閒聊-chat"
        );
        if (!channel) return;

        const canvas = Canvas.createCanvas(700, 250);
        const context = canvas.getContext("2d");

        const background = await Canvas.loadImage("../data/wallpaper.jpg");
        context.drawImage(background, 0, 0, canvas.width, canvas.height);

        context.strokeStyle = "#74037b";
        context.strokeRect(0, 0, canvas.width, canvas.height);

        context.font = "28px sans-serif";
        context.fillStyle = "#ffffff";
        context.fillText(
            "Welcome to the server,",
            canvas.width / 2.5,
            canvas.height / 3.5
        );

        context.font = applyText(canvas, `${member.displayName}!`);
        context.fillStyle = "#ffffff";
        context.fillText(
            `${member.displayName}!`,
            canvas.width / 2.5,
            canvas.height / 1.8
        );

        context.font = applyText(canvas, `${member.displayName}!`);
        context.fillStyle = "#ffffff";
        context.fillText(
            `bruuuuuuuuuuuuuuuuuh`,
            canvas.width / 2.5,
            canvas.height / 0.8
        );

        context.beginPath();
        context.arc(125, 125, 100, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();

        const avatar = await Canvas.loadImage(
            member.user.displayAvatarURL({ format: "jpg" })
        );
        context.drawImage(avatar, 25, 25, 200, 200);

        const attachment = new Discord.MessageAttachment(
            canvas.toBuffer(),
            "welcome-image.png"
        );

        channel.send(`Welcome to the server, ${member}!`, attachment);
    },
};