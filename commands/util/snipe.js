const { reply, error, getSnipes } = require('../../functions/Util.js');
const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

async function snipe(command, args, language) {
    const snipeWithGuild = await getSnipes(command.client, command.guild.id);
    if (!snipeWithGuild) return error(command, language.noSnipe);
    const snipes = snipeWithGuild.snipes;
    const arg = args[0] ?? 1;

    if (Number(arg) > 10) return error(command, language.exceed10);
    const msg = snipes?.[Number(arg) - 1];
    if (!msg) return error(command, language.invalidSnipe);

    const embed = new MessageEmbed()
        .setColor('RANDOM')
        .setAuthor({ name: msg.author, iconURL: msg.authorAvatar })
        .setDescription(msg.content)
        .setTimestamp(msg.timestamp)
        .setImage(msg.attachment);
    return reply(command, { embeds: [embed] });
}
module.exports = {
    name: 'snipe',
    guildOnly: true,
    data: new SlashCommandBuilder()
        .setName('snipe')
        .setDescriptionLocalizations({
            'en_US': 'Snipe a message.',
            'zh_CN': '狙击一条讯息',
            'zh_TW': '狙擊一條訊息',
        })
        .addIntegerOption(option => option
            .setName('number')
            .setDescriptionLocalizations({
                'en_US':'message to snipe, default to 1',
                'zh_CN': '要狙击的讯息,默認為1',
                'zh_TW': '要狙擊的訊息,默認為1',
            })
            .setRequired(true),
        ),
    async execute(interaction, language) {
        await snipe(interaction, [interaction.options.getInteger('number') ?? 1], language);
    },
};
