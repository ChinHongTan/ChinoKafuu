module.exports = {
    name: 'fetchimage',
    aliases: ['fi', 'fetch-image', 'imagefetch'],
    description: 'fetch some images',
    execute(message, imageChannels) {
        const fs = require('fs');
        const request = require('request');
        const Discord = require('discord.js');
        var http = require("http");

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

        imageChannels.forEach(ID => {
            var image = [];
            var numbers = new Object();
            message.client.channels.fetch(ID)
                .then(channel => {
                    message.channel.send(`Fetching ${channel.name}`);
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
                        console.log(channel.name);
                        console.log(numbers);
                        console.log(`Total: ${total}`);
                        let data = JSON.stringify(image, null, 2);
                        var filename = channel.name + '.json';
                        fs.writeFileSync(`./images/` + filename, data);
                        message.channel.send(`Done fetching ${channel.name}`)
                    })();
                    
                });
        });
    },
};

/*
                        var counter = 0
                        let embed = new Discord.MessageEmbed()
                            .setColor('#2d9af8').setTitle(`Download Progress`).setDescription(`Initializing data...`).setFooter(`Download images from ${channel.name}...`);
                        message.channel.send(embed).then(msg => {
                            while (counter <= total) {
                                properties = image[counter]
                                fileList = properties.attachments
                                fileList.forEach(values => {
                                    var url = values.url;
                                    var name = values.name;
                                    request.get(url, function (error, response, body) {
                                        console.error('error:', error);
                                        request.pipe(fs.createWriteStream(`C:/Users/User/Desktop/image/`+ counter + name ));
                                        counter ++;
                                    embed.setDescription(`Downloading ${name}...`).setImage(url).setFooter(`${counter} / ${total} images downloaded.`);
                                    msg.edit(embed);
                                    console.log('hi');
                                    })

                                });
                            };
                        });
*/










/*
var http = require("http");

var options = {
    "method": "POST",
    "hostname": "api2.online-convert.com",
    "port": null,
    "path": "/jobs",
    "headers": {
        "x-oc-api-key": "<your API key here>",
        "content-type": "application/json",
        "cache-control": "no-cache"
    }
};

var req = http.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
        chunks.push(chunk);
    });

    res.on("end", function () {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
    });
});

req.write(JSON.stringify({ input: [ { type: 'remote', source: 'https://static.online-convert.com/example-file/raster%20image/jpg/example_small.jpg' } ],
conversion: [ { category: 'image', target: 'png' } ] }));
req.end();
*/
