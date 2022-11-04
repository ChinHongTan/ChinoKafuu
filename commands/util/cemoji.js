const { SlashCommandBuilder } = require('@discordjs/builders');
const { success, error } = require('../../functions/Util.js');

async function addEmoji(command, string, language) {
    // id of the emoji
    const emojiID = string.match(/(?<=:.*:).+?(?=>)/g);
    // name of the emoji
    const emojiName = string.match(/(?<=<).+?(?=:\d+>)/g);
    if (!emojiID || !emojiName) return error(command, language.noEmoji);
    // combine id and name into an object
    const emojiObj = emojiName.reduce((obj, key, index) => {
        obj[key] = emojiID[index];
        return obj;
    }, {});

    for (const [name, id] of Object.entries(emojiObj)) {
        if (name.startsWith('a:')) {
            const emoji = await command.guild.emojis.create(`https://cdn.discordapp.com/emojis/${id}.gif?v=1`, name.substring(2));
            await success(command, language.addSuccess.replace('${emoji.name}', emoji.name).replace('${emoji}', emoji));
        } else {
            const emoji = await command.guild.emojis.create(`https://cdn.discordapp.com/emojis/${id}.png?v=1`, name.substring(1));
            await success(command, language.addSuccess.replace('${emoji.name}', emoji.name).replace('${emoji}', emoji));
        }
    }
}
module.exports = {
    name: 'cemoji',
    coolDown: 3,
    data: new SlashCommandBuilder()
        .setName('cemoji')
        .setDescriptionLocalizations({
            'en-US': 'Copy emoji from other guilds! (nitro needed)',
            'zh-CN': '从其他伺服器复制表情!(需要nitro)',
            'zh-TW': '從其他伺服器復製表情!(需要nitro)',
        })
        .addStringOption(option => option
            .setName('emoji')
            .setDescriptionLocalizations({
                'en-US': 'Emoji to copy(nitro needed)',
                'zh-CN': '要复制的表情(需要nitro)',
                'zh-TW': '要複製的表情(需要nitro)',
            })
            .setRequired(true),
        ),
    async execute(interaction, language) {
        await addEmoji(interaction, interaction.options.getString('emoji'), language);
    },
};
