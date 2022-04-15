const { SlashCommandBuilder } = require('@discordjs/builders');
const { reply } = require('../../functions/commandReply.js');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');

async function editSnipe(command, args, language) {
    const collection = command.client.editSnipeCollection;

    let editSnipesWithGuild;
    if (collection) {
        editSnipesWithGuild = await collection.findOne({ id: command.guild.id });
    } else {
        const rawData = fs.readFileSync('./data/editSnipes.json', 'utf-8');
        editSnipesWithGuild = JSON.parse(rawData);
    }
    const arg = args[0] ?? 1;

    if (editSnipesWithGuild) {
        const editsnipes = editSnipesWithGuild.editSnipe;
        if (Number(arg) > 10) return reply(command, language.exceed10, 'RED');
        const msg = editsnipes?.[Number(arg) - 1];
        if (!msg) return reply(command, language.invalidSnipe, 'RED');
        const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setAuthor({ name: msg.author, iconURL: msg.authorAvatar })
            .setDescription(msg.content)
            .setTimestamp(msg.timestamp);
        return reply(command, { embeds: [embed] });
    }
    return reply(command, language.noSnipe, 'RED');
}
module.exports = {
    name: 'editsnipe',
    aliases: ['esnipe'],
    guildOnly: true,
    description: {
        'en_US': 'Snipe an edited message.',
        'zh_CN': '狙击已编辑的讯息',
        'zh_TW': '狙擊已編輯的訊息',
    },
    async execute(message, args, language) {
        await editSnipe(message, args, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder()
            .addIntegerOption((option) => option.setName('number').setDescription('message to snipe')),
        async execute(interaction, language) {
            await editSnipe(interaction, [interaction.options.getInteger('number') ?? 1], language);
        },
    },
};
