module.exports = {
    async storeSnipes(message) {
        const collection = message.client.snipeCollection;
        const rawData = await collection.findOne({ id: message.guild.id });
        const snipeWithGuild = rawData ?? { id: message.guild.id };
        if (message.author.bot) return;
        if (!message.guild) return;

        const snipe = {};
        const snipes = snipeWithGuild?.snipes ?? [];
        snipe.author = message.author.tag;
        snipe.authorAvatar = message.author.displayAvatarURL({
            format: 'png',
            dynamic: true,
        });
        snipe.content = message.content ?? 'None';
        snipe.timestamp = message.createdAt.toUTCString([8]);
        snipe.attachments = message.attachments.first()?.proxyURL;

        snipes.unshift(snipe);
        if (snipes.length > 10) snipes.pop();
        snipeWithGuild.snipes = snipes;
        const query = { id: message.guild.id };
        const options = { upsert: true };
        await collection.replaceOne(query, snipeWithGuild, options);
    },
    async storeEditSnipes(oldMessage, newMessage) {
        const collection = oldMessage.client.editSnipeCollection;
        const rawData = await collection.findOne({ id: oldMessage.guild.id });
        const editSnipeWithGuild = rawData ?? { id: oldMessage.guild.id };

        if (oldMessage.author.bot) return;
        if (!oldMessage.guild) return;

        const editSnipe = {};
        const editSnipes = editSnipeWithGuild?.editSnipe ?? [];

        editSnipe.author = newMessage.author.tag;
        editSnipe.authorAvatar = newMessage.author.displayAvatarURL({
            format: 'png',
            dynamic: true,
        });
        editSnipe.content = oldMessage.content ?? 'None';
        if (newMessage.editedAt) {
            editSnipe.timestamp = newMessage.editedAt.toUTCString([8]);
            editSnipes.unshift(editSnipe);
        }
        if (editSnipes.length > 10) editSnipes.pop();
        editSnipeWithGuild.editSnipe = editSnipes;
        const query = { id: oldMessage.guild.id };
        const options = { upsert: true };
        await collection.replaceOne(query, editSnipeWithGuild, options);
    },
    async dynamic(oldState, newState) {
        if (newState.member.user.bot) return;
        const mainChannel = oldState.guild.channels.cache.find((channel) => channel.id === '881378732705718292');
        if (mainChannel) {
            const channels = mainChannel.parent.children;
            channels.each((channel) => {
                if (channel.id === '881378732705718292') return;
                if (channel.members.size < 1) channel.delete();
            });
        }
        if (newState.channelId === '881378732705718292') {
            const voiceChannel = await newState.guild.channels
                .create(`${newState.member.displayName}的頻道`, {
                    type: 'GUILD_VOICE',
                    bitrate: 256000,
                    userLimit: 99,
                    parent: newState.guild.channels.cache.find(
                        (channel) => channel.id === '881378732705718292',
                    ).parent,
                });
            await newState.member.voice.setChannel(voiceChannel);
        }
    },
    async sendWelcomeMessage(member) {
        const Discord = require('discord.js');
        const Canvas = require('canvas');

        const applyText = (canvas, text) => {
            const context = canvas.getContext('2d');
            let fontSize = 70;

            do {
                context.font = `${(fontSize -= 10)}px sans-serif`;
            } while (context.measureText(text).width > canvas.width - 300);

            return context.font;
        };

        const channel = member.guild.channels.cache.find((ch) => ch.name === '閒聊-chat');
        if (!channel) return;

        const canvas = Canvas.createCanvas(700, 250);
        const context = canvas.getContext('2d');

        const background = await Canvas.loadImage('../data/wallpaper.jpg');
        context.drawImage(background, 0, 0, canvas.width, canvas.height);

        context.strokeStyle = '#74037b';
        context.strokeRect(0, 0, canvas.width, canvas.height);

        context.font = '28px sans-serif';
        context.fillStyle = '#ffffff';
        context.fillText('Welcome to the server,', canvas.width / 2.5, canvas.height / 3.5);

        context.font = applyText(canvas, `${member.displayName}!`);
        context.fillStyle = '#ffffff';
        context.fillText(`${member.displayName}!`, canvas.width / 2.5, canvas.height / 1.8);

        context.font = applyText(canvas, `${member.displayName}!`);
        context.fillStyle = '#ffffff';
        context.fillText('bruuuuuuuuuuuuuuuuuh', canvas.width / 2.5, canvas.height / 0.8);

        context.beginPath();
        context.arc(125, 125, 100, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();

        const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
        context.drawImage(avatar, 25, 25, 200, 200);

        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

        channel.send(`Welcome to the server, ${member}!`, attachment);
    },
    getEditDistance(a, b) {
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;

        const matrix = [];

        // increment along the first column of each row
        let i;
        for (i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }

        // increment each column in the first row
        let j;
        for (j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }

        // Fill in the rest of the matrix
        for (i = 1; i <= b.length; i++) {
            for (j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                }
                else {
                    matrix[i][j] = Math.min(
                        // substitution
                        matrix[i - 1][j - 1] + 1,
                        Math.min(
                            matrix[i][j - 1] + 1,
                            // insertion
                            matrix[i - 1][j] + 1,
                        ),
                        // deletion
                    );
                }
            }
        }

        return matrix[b.length][a.length];
    },
};
