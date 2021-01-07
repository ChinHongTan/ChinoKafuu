module.exports = {
	name: 'embed',
	description: 'sends an embed',
	execute(message, args) {
		const Discord = require('discord.js');
		var http = require("http");

		var options = {
		    "method": "POST",
		    "hostname": "api2.online-convert.com",
		    "port": null,
		    "path": "/jobs",
		    "headers": {
		        "x-oc-api-key": "1ad280a460b3c7c978cfd3f1a9a92344",
		        "content-type": "application/json",
		        "cache-control": "no-cache"
		    }
		};

		async function sendRequest(callback) {

			var req = http.request(options, function (res) {
			    var chunks = [];

			    res.on("data", function (chunk) {
			        chunks.push(chunk);
			    });

			    res.on("end", function () {
			        var body = Buffer.concat(chunks);
			        data = JSON.parse(body.toString());
			        console.log(data.status.code);
			        callback(data);
			    });
			});

			req.write(JSON.stringify({ input: [ { type: 'remote', source: 'https://static.online-convert.com/example-file/raster%20image/jpg/example_small.jpg' } ],
			conversion: [ { category: 'image', target: 'png' } ] }), null, 2);
			req.end();
		};

		function getData(data) {
			var optionsGet = {
				"method": "GET",
				"hostname": "api2.online-convert.com",
				"port": null,
				"path": "/jobs/" + data.id,
				"headers": {
					"x-oc-api-key": "1ad280a460b3c7c978cfd3f1a9a92344",
					"cache-control": "no-cache"
				},
			};

			var interval = setInterval(() => {
				const req2 = http.request(optionsGet, res => {
					console.log(`statusCode: ${res.statusCode}`);

					var cs = [];

					res.on('data', d => {
						cs.push(d);
					});

					res.on('end', () => {
						var text = Buffer.concat(cs);
						var info = JSON.parse(text.toString());
						console.log(info.status.code);
						if (info.status.code === 'completed') {
							clearInterval(interval);
							console.log(info.output[0].uri);
						}
					});
				});

				req2.on('error', error => {
					console.error(error);
				});
				req2.end();

			}, 500);

		};

		sendRequest(getData);


		let msg = ':green_square:'
		let embed = new Discord.MessageEmbed()
            .setColor('#2d9af8').setTitle(`Progress...`).setDescription(msg.repeat(25)).setFooter("智乃乃")
        message.channel.send(embed).then(msg =>{
        	for (i = 0; i < 5; i++) {
            	embed
        	    	.setDescription(i)
        		msg.edit(embed)
            }
        })

		message.channel.send('pinging...').then(msg => {
		    let embed = new Discord.MessageEmbed()
		        .setDescription(`${msg.createdTimestamp - message.createdTimestamp}`)
		    msg.edit(embed)
		})
	},
};