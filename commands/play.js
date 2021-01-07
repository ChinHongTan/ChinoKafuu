module.exports = {
	name: 'play',
	aliases: ['p'],
	description: 'Play a song',
	guildOnly: true,

	execute(message, args) {
		const ytdl = require("ytdl-core");
        
		var servers = {}
		var server = servers[message.guild.id];
		
		function play(connection, message){
			var server = servers[message.guild.id];
			var str = String(message)
			var key = str.split(/\s/);


            // If user inputs skip, skip the song
			try {
            	server.dispatcher = connection.play(ytdl(server.queue[0], {filter: "audio"}));
            } catch (error) {
            	if (key[1] == "skip") {
                	server.dispatcher.destroy();
                } else {
                	message.channel.send("You need to provide a correct url!");
                	console.log(error)
                	}
            	return;
            	}

            queue.shift();

			server.dispatcher.on("finish", function(){
			if (queue[0]){
				play(connection, message);
			} else {
				connection.disconnect();
			}
		});
        }
//-------------------------------------------------------------------------------------

		if (!args[0]) {
			message.channel.send("You need to provide a link!");
			return;
		}

		if (!message.member.voice.channel){
			message.channel.send("You must be in a voice channel to use this command!");
			return;
		}

		if (!servers[message.guild.id]) servers[message.guild.id] = {
		    queue: []
		}

		var server = servers[message.guild.id];

		server.queue.push(args[0]);

		if (!message.guild.voiceConnection) message.member.voice.channel.join().then(function(connection){
            play(connection, message);
		});
}}