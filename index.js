const RPC = require('discord-rpc');
const client = new RPC.Client({
    transport: 'ipc'
});

client.on('ready', () => {
    client.request('SET_ACTIVITY', {
        pid: process.pid,
        activity: {
            details: "Licking loli",
            state: "Chino Kafuu",
            timestamps: {
                start: Date.now()
            },
            assets: {
                large_image: "loli", // large image key from developer portal > rich presence > art assets
                large_text: "sweet!"
            },
            buttons: [
                { label: "Join my server!", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
                { label: "Loli here!", url: "https://youtu.be/WwDz_J5oGUk" }
            ]
        }
    });
});

client.login({
    clientId: '848557649574101013', // put the client id from the dev portal here
    clientSecret: 'loQlDENU7LmgMkVisF3-Ama7jsJndmFp' // put the client secret from the dev portal here
});