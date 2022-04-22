const { reply } = require('../../functions/commandReply.js');
// eslint-disable-next-line no-unused-vars
const { Message, CommandInteraction } = require('discord.js');
/**
 * Copy an emoji from other guilds
 * @param {Message | CommandInteraction} command - The message or slash command that called this function
 * @param {string} string - String containing emoji
 * @param {object} language - Language used by the guild
 */
async function addEmoji(command, string, language) {
    // id of the emoji
    const emojiID = string.match(/(?<=:.*:).+?(?=>)/g);
    // name of the emoji
    const emojiName = string.match(/(?<=<).+?(?=:\d+>)/g);
    if (!emojiID || !emojiName) return reply(command, language.noEmoji, 'RED');
    // combine id and name into an object
    const emojiObj = emojiName.reduce((obj, key, index) => {
        obj[key] = emojiID[index];
        return obj;
    }, {});

    for (const [name, id] of Object.entries(emojiObj)) {
        if (name.startsWith('a:')) {
            const emoji = await command.guild.emojis.create(`https://cdn.discordapp.com/emojis/${id}.gif?v=1`, name.substring(2));
            await reply(command, language.addSuccess.replace('${emoji.name}', emoji.name).replace('${emoji}', emoji), 'BLUE');
        } else {
            const emoji = await command.guild.emojis.create(`https://cdn.discordapp.com/emojis/${id}.png?v=1`, name.substring(1));
            await reply(command, language.addSuccess.replace('${emoji.name}', emoji.name).replace('${emoji}', emoji), 'BLUE');
        }
    }
}
module.exports = {
    name: 'cemoji',
    cooldown: 3,
    description: {
        'en_US': 'Copy emoji from other guilds! (nitro needed)',
        'zh_CN': '从其他伺服器复制表情!（需要nitro）',
        'zh_TW': '從其他伺服器復製表情!（需要nitro）',
    },
    options: [
        {
            name: 'emoji',
            description: {
                'en_US': 'Emoji to copy(nitro needed)',
                'zh_CN': '要复制的表情（需要nitro）',
                'zh_TW': '要複製的表情（需要nitro）',
            },
            type: 'STRING',
            required: true,
        },
    ],
    async execute(message, _args, language) {
        await addEmoji(message, message.content, language);
    },
    slashCommand: {
        async execute(interaction, language) {
            await addEmoji(interaction, interaction.options.getString('emoji'), language);
        },
    },
};
