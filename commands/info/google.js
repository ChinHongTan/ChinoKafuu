module.exports = {
    name: 'google',
    description: true,
    async execute(message, args, language) {
        const google = require('googlethis');
        const options = {
            page: 0,
            safe: false,
            additional_params: {
                hl: 'zh_TW',
            },
        };
        const keyword = message.content.substr(message.content.indexOf(' ') + 1);
        const response = await google.search(keyword, options);
        message.channel.send({
            embeds: [{
                title: response.results[0].title,
                url: response.results[0].url,
                description: response.results[0].description,
                color: 'BLUE',
            }],
        });
        const images = await google.image(keyword, options);
        const cleanPanel = { ...response.knowledge_panel };
        delete cleanPanel.title;
        delete cleanPanel.description;
        delete cleanPanel.url;
        delete cleanPanel.images;
        delete cleanPanel.type;
        for (const [key, value] of Object.entries(response.knowledge_panel)) {
            if (value === 'N/A') delete response.knowledge_panel[key];
        }
        console.log(response.knowledge_panel);
        if (response.knowledge_panel && Object.keys(response.knowledge_panel).length !== 0) {
            const fields = [];
            for (const [key, value] of Object.entries(cleanPanel)) {
                const entry = {};
                entry['name'] = key;
                entry['value'] = value;
                fields.push(entry);
            }
            console.log(fields);
            message.channel.send({
                embeds: [{
                    title: `Knowledge Panel: ${response.knowledge_panel.title ?? 'None'}`,
                    description: response.knowledge_panel.description,
                    url: response.knowledge_panel.url,
                    fields: fields,
                    image: { url: response.knowledge_panel.images?.[0] ?? images?.[0]?.url ?? '' },
                }],
            });
        }

    },
};
