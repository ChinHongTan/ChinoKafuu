const { error, reply, getEditSnipes } = require('../../functions/Util.js');
const { MessageEmbed } = require('discord.js');

async function editSnipe(command, args, language) {
    const editSnipesWithGuild = await getEditSnipes(command.client, command.guild.id);
    const arg = args[0] ?? 1;
    if (!editSnipesWithGuild) return error(command, language.noSnipe);

    const editSnipes = editSnipesWithGuild.editSnipe;
    if (Number(arg) > 10) return error(command, language.exceed10);
    const msg = editSnipes?.[Number(arg) - 1];
    if (!msg) return error(command, language.invalidSnipe);
    const embed = new MessageEmbed()
        .setColor('RANDOM')
        .setAuthor({ name: msg.author, iconURL: msg.authorAvatar })
        .setDescription(msg.content)
        .setTimestamp(msg.timestamp);
    return reply(command, { embeds: [embed] });
}
module.exports = {
    name: 'edit-snipe',
    aliases: ['esnipe'],
    guildOnly: true,
    description: {
        'en_US': 'Snipe an edited message.',
        'zh_CN': '狙击已编辑的讯息',
        'zh_TW': '狙擊已編輯的訊息',
    },
    options: [
        {
            name: 'number',
            description: {
                'en_US': 'message to snipe, default to 1',
                'zh_CN': '要狙击的讯息，默認為1',
                'zh_TW': '要狙擊的訊息，默認為1',
            },
            type: 'INTEGER',
            required: true,
        },
    ],
    async execute(message, args, language) {
        await editSnipe(message, args, language);
    },
    slashCommand: {
        async execute(interaction, language) {
            await editSnipe(interaction, [interaction.options.getInteger('number') ?? 1], language);
        },
    },
};
