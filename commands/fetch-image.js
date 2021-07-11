module.exports = {
    name: 'fetchimage',
    cooldown: 60,
    aliases: ['fi', 'fetch-image', 'imagefetch'],
    description: 'fetch images send in guild (partially useless command)',
    execute(client, message, args) {
        const fs = require('fs');
        const guild = message.client.guilds.cache.get('764839074228994069');
        const totalImageCount = [];
        const memberProfile = [];
        const channelArray = [];

        async function * messagesIterator (channel) {
            let before = null;
            let done = false;
            while (!done) {
                const messages = await channel.messages.fetch({ limit: 100, before });
                if (messages.size > 0) {
                    before = messages.lastKey();
                    yield messages;
                } else done = true;
            };
        };

        async function * loadAllMessages (channel) {
            for await (const messages of messagesIterator(channel)) {
                for (const message of messages.values()) yield message;
            };
        };

        function sum (obj) {
            var sum = 0;
            for (var el in obj) {
                if (obj.hasOwnProperty(el) ) {
                    sum += parseFloat(obj[el]);
                };
            };
            return sum;
        };

        function getGrandTotal (value) {
            const imageCount = value.reduce((imageCount, image) => {
                for (const [author, images] of Object.entries(image)) {
                    if (!imageCount[author]) {
                        imageCount[author] = 0;
                    };

                    imageCount[author] += images;
                };

                return imageCount;
            }, {});
            console.log(imageCount);
            var grandTotal = sum(imageCount);
            console.log(`Grand Total: ${grandTotal}`);
            return imageCount;
        };

        async function fetchImageChannels (imageChannels) {
            imageChannels.forEach(ID => {
                totalImageCount.push (new Promise (function (resolve, reject) {
                    var image = [];
                    var numbers = new Object();
                    message.client.channels.fetch(ID)
                        .then(channel => {
                            console.log(`Fetching ${channel.name}`);
                            var total = 0;
                            (async () => {
                                for await (const messages of loadAllMessages(channel)) {
                                    if (messages.attachments.size > 0) {
                                        var images = new Object();
                                        images.author = messages.author.username;
                                        var urlArray = [];
                                        messages.attachments.each(attachments => {
                                            var file = new Object();
                                            file.name = attachments.name;
                                            file.url = attachments.url;
                                            urlArray.push(file);
                                        });
                                        images.attachments = urlArray;
                                        images.createdAt = messages.createdAt;
                                        images.messageurl = messages.url
                                        image.push(images);
                                        var name = messages.author.username;
                                        if (!name in numbers || numbers[name] === undefined) {
                                            numbers[name] = messages.attachments.size;
                                        } else {
                                            numbers[name] += messages.attachments.size;
                                        };
                                    };
                                    total += messages.attachments.size;
                                };
                                var channelInfo = new Object();
                                channelInfo[channel.name] = numbers
                                console.log(channel.name);
                                console.log(numbers);
                                console.log(`Total: ${total}`);
                                let data = JSON.stringify(image, null, 2);
                                var filename = channel.name + '.json';
                                fs.writeFileSync(`./images/` + filename, data);
                                console.log(`Done fetching ${channel.name}`);
                                resolve(channelInfo);
                            })();
                            
                        });
                }));
            });
            await Promise.all(totalImageCount).then((value) => {

                const loliPic25 = guild.roles.cache.find(role => role.id === '765215141641060412');
                const explicitPic25 = guild.roles.cache.find(role => role.id === '765571817003286569');
                const vtuberPic25 = guild.roles.cache.find(role => role.id === '766832086836707348');
                const tolPic300 = guild.roles.cache.find(role => role.id === '797711580967862272');
                const tolPic500 = guild.roles.cache.find(role => role.id === '797711805308207165');
                const tolPic700 = guild.roles.cache.find(role => role.id === '800730178090303488');
                const tolPic1000 = guild.roles.cache.find(role => role.id === '781523067397865482');

                value.forEach(ch => {
                    channelArray.push(Object.values(ch)[0]);
                });
                var imageCount = getGrandTotal(channelArray);
                for (const [name, number] of Object.entries(imageCount)) {
                    var userInfo = new Object();
                    userInfo.name = name;
                    var user = guild.members.cache.find(member => member.user.username === name);
                    imagesSendByUser = new Object();
                    value.forEach(channelInfo => {
                        channelName = Object.keys(channelInfo)[0];
                        channelID = guild.channels.cache.find(channel => channel.name === channelName).id;
                        picsInChannel = channelInfo[channelName];
                        if (name in picsInChannel) {
                            imagesSendByUser[channelName] = picsInChannel[name];
                            if (user && picsInChannel[name] >= 25 && channelID === '764840462707326986') {
                                user.roles.add(loliPic25);
                                console.log(`Added ${loliPic25.name} to ${user.user.username}`);
                            };
                        };
                    });
                    userInfo.imagesSendByUser = imagesSendByUser;
                    userInfo.total = number;

                    var vtuber = imagesSendByUser[guild.channels.cache.find(channel => channel.id === '768430617733496842').name] ?? 0; //vtuber
                    var vtuber18r = imagesSendByUser[guild.channels.cache.find(channel => channel.id === '766636820066074656').name] ?? 0;  //vtuber 18r
                    var gura = imagesSendByUser[guild.channels.cache.find(channel => channel.id === '765525905807769621').name] ?? 0; //gura
                    var _18r = imagesSendByUser[guild.channels.cache.find(channel => channel.id === '765176655407874081').name] ?? 0; //18r

                    var vtuberSum = vtuber + vtuber18r + gura;
                    var _18rSum = vtuber18r + _18r;

                    if (user && vtuberSum >= 25) {
                        user.roles.add(vtuberPic25);
                        console.log(`Added ${vtuberPic25.name} to ${user.user.username}`);
                    };
                    if (user && _18rSum >= 25) {
                        user.roles.add(explicitPic25);
                        console.log(`Added ${explicitPic25.name} to ${user.user.username}`);
                    };

                    if (user && number >= 300) {
                        user.roles.add(tolPic300);
                        console.log(`Added ${tolPic300.name} to ${user.user.username}`);
                    };
                    if (user && number >= 500) {
                        user.roles.add(tolPic500);
                        console.log(`Added ${tolPic500.name} to ${user.user.username}`);
                    };
                    if (user && number >= 700) {
                        user.roles.add(tolPic700);
                        console.log(`Added ${tolPic700.name} to ${user.user.username}`);
                    }
                    if (user && number >= 1000) {
                        user.roles.add(tolPic1000);
                        console.log(`Added ${tolPic1000.name} to ${user.user.username}`);
                    };
                    console.log(JSON.stringify(memberProfile, null, 2));
                    console.log(`User Info: ${JSON.stringify(userInfo, null, 2)}`);
                    memberProfile.push(userInfo);
                };
                profileWithTimestamp = new Object();
                profileWithTimestamp[new Date().toLocaleString()] = memberProfile;
                let data = JSON.stringify(profileWithTimestamp, null, 2);
                fs.writeFileSync(`./memberProfile.json`, data);
                return message.channel.send("Done saving image urls.");
            });
        };
        if(!message.member.hasPermission("ADMINISTRATOR")){
            return message.channel.send(":x: | You must be an administrator of this server to load a backup!");
        };
        if(imageChannels.length < 1) {
            var imageChannels = ['765176655407874081', '766636820066074656', '765525905807769621', '768430617733496842', '764840462707326986'];
        };
        fetchImageChannels(imageChannels);       
    },
};