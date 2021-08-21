module.exports = {
    name: "google",
    description: true,
    async execute(message, args, language) {
        const google = require("googlethis");
        const options = {
            page: 0,
            safe: false,
            additional_params: {
                hl: 'zh_TW'
            }
        }
        let keyword = message.content.substr(message.content.indexOf(" ") + 1);
        const response = await google.search(keyword, options);
        console.log(response);
        console.log(message.flags)
        message.channel.send({
            embed: {
                title: response.results[0].title,
                url: response.results[0].url,
                description: response.results[0].description,
                color: "BLUE"
            }
        });
        const images = await google.image(keyword, options);
        console.log(images);
        console.log(images[0].url);
        message.channel.send({
            embed: {
                title: images[0].origin.title,
                url: images[0].origin.website,
                image: {
                    url: images[0].url
                },
                color: "BLUE"
            }
        });
    },
};