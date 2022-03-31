const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const commandReply = new CommandReply();
const { MessageEmbed } = require('discord.js');
const google = require('googlethis');

async function googleFunc(command, keyword, language) {
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
    delete cleanPanel.title;
    delete cleanPanel.description;
    delete cleanPanel.url;
    delete cleanPanel.images;
    delete cleanPanel.type;
    for (const [key, value] of Object.entries(response.knowledge_panel)) {
        if (value === 'N/A') delete response.knowledge_panel[key];
    }
    if (!response.knowledge_panel.title && !response.knowledge_panel.url && !response.knowledge_panel.description) {
        response.knowledge_panel.title = response.results[0].title;
        response.knowledge_panel.url = response.results[0].url;
        response.knowledge_panel.description = response.results[0].description;
    }

    if (response.knowledge_panel && Object.keys(response.knowledge_panel).length !== 0) {
        const fields = [];
        for (const [key, value] of Object.entries(cleanPanel)) {
            const entry = {};
            entry['name'] = key;
            entry['value'] = value;
            fields.push(entry);
        }
        let knowledgePanel = new MessageEmbed()
            .setTitle(`Knowledge Panel: ${response.knowledge_panel.title ?? 'None'}`)
            .setDescription(response.knowledge_panel.description)
            .setURL(response.knowledge_panel.url)
            .setFields(fields)
            .setImage(response.knowledge_panel.images?.[0] ?? images?.[0]?.url ?? '')
            .setColor('BLUE')
        commandReply.edit(command, knowledgePanel);
    }
}

module.exports = {
    name: 'google',
    description: true,
    async execute(message, args, language) {
        let reply = await message.channel.send('Please wait...');
        await googleFunc(reply, message.content.substr(message.content.indexOf(' ') + 1), language)
    },
    slashCommand: {
        data: new SlashCommandBuilder()
            .addStringOption((option) => option.setName('query').setDescription('Search google').setRequired(true)),
        async execute(interaction, language) {
            await interaction.deferReply();
            await googleFunc(interaction, interaction.options.getString('query'), language);
        },
    },
};
