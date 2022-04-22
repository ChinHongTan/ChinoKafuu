const { edit } = require('../../functions/commandReply.js');
const { MessageEmbed } = require('discord.js');
const google = require('googlethis');

async function googleFunc(command, keyword) {
    const options = {
        page: 0,
        safe: false,
        additional_params: {
            hl: 'zh_TW',
        },
    };
    const response = await google.search(keyword, options);
    const images = await google.image(keyword, options);
    const cleanPanel = { ...response.knowledge_panel };
    // delete this 5 keys from response
    ['title', 'description', 'url', 'images', 'type'].forEach(key => delete cleanPanel[key]);
    for (const [key, value] of Object.entries(response.knowledge_panel)) {
        // remove unavailable keys
        if (value === 'N/A') delete response.knowledge_panel[key];
    }

    // knowledge_panel probably doesn't exist, use first result instead
    if (!response.knowledge_panel.title && !response.knowledge_panel.url && !response.knowledge_panel.description) {
        response.knowledge_panel.title = response.results[0].title;
        response.knowledge_panel.url = response.results[0].url;
        response.knowledge_panel.description = response.results[0].description;
    }

    if (response.knowledge_panel && Object.keys(response.knowledge_panel).length !== 0) {
        const fields = [];
        for (const [key, value] of Object.entries(cleanPanel)) {
            const entry = {
                name: key,
                value: value,
            };
            fields.push(entry);
        }
        const knowledgePanel = new MessageEmbed()
            .setTitle(`Knowledge Panel: ${response.knowledge_panel.title ?? 'None'}`)
            .setDescription(response.knowledge_panel.description)
            .setURL(response.knowledge_panel.url)
            .setFields(fields)
            .setImage(response.knowledge_panel.images?.[0] ?? images?.[0]?.url ?? '')
            .setColor('BLUE');
        await edit(command, knowledgePanel);
    }
}

module.exports = {
    name: 'google',
    description: {
        'en_US': 'Search query on Google',
        'zh_CN': '在谷歌上搜索关键字',
        'zh_TW': '在谷歌上搜索關鍵字',
    },
    async execute(message, _args, language) {
        const repliedMsg = await message.channel.send(language.wait);
        await googleFunc(repliedMsg, message.content.substring(message.content.indexOf(' ') + 1));
    },
    options: [
        {
            name: 'query',
            description: {
                'en_US': 'Search google)',
                'zh_CN': '谷歌搜索',
                'zh_TW': '谷歌搜索',
            },
            type: 'STRING',
            required: true,
        },
    ],
    slashCommand: {
        async execute(interaction) {
            await interaction.deferReply();
            await googleFunc(interaction, interaction.options.getString('query'));
        },
    },
};
