const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const commandReply = new CommandReply();
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
    if (!emojiID || !emojiName) return commandReply.reply(command, language.noEmoji, 'RED');
    // combine id and name into an object
    const emojiObj = emojiName.reduce((obj, key, index) => {
        obj[key] = emojiID[index];
        return obj;
    }, {});

    for (const [name, id] of Object.entries(emojiObj)) {
        if (name.startsWith('a:')) {
            const emoji = await command.guild.emojis.create(`https://cdn.discordapp.com/emojis/${id}.gif?v=1`, name.substring(2));
            await commandReply.reply(command, language.addSuccess.replace('${emoji.name}', emoji.name).replace('${emoji}', emoji), 'BLUE');
        }
        else {
            const emoji = await command.guild.emojis.create(`https://cdn.discordapp.com/emojis/${id}.png?v=1`, name.substring(1));
            await commandReply.reply(command, language.addSuccess.replace('${emoji.name}', emoji.name).replace('${emoji}', emoji), 'BLUE');
        }
    }
}
module.exports = {
    name: 'cemoji',
    cooldown: 3,
    description: true,
    async execute(message, _args, language) {
        await addEmoji(message, message.content, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder()
            .addStringOption((option) => option.setName('emoji').setDescription('Emoji').setRequired(true)),
        async execute(interaction, language) {
            await addEmoji(interaction, interaction.options.getString('emoji'), language);
        },
    },
};
