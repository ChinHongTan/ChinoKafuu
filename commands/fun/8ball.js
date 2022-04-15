const { SlashCommandBuilder } = require('@discordjs/builders');
const { reply } = require('../../functions/commandReply.js');

function eightBall(command, args, language) {
    if (!args[0]) return reply(command, 'Psst. You need to ask the 8ball a question, ya\'know?', 'YELLOW');
    const question = args[0];
    const answers = [
        { reply1: 'GREEN' },
        { reply2: 'GREEN' },
        { reply3: 'GREEN' },
        { reply4: 'GREEN' },
        { reply5: 'GREEN' },
        { reply6: 'GREEN' },
        { reply7: 'GREEN' },
        { reply8: 'GREEN' },
        { reply9: 'GREEN' },
        { reply10: 'GREEN' },
        { reply11: 'BLUE' },
        { reply12: 'BLUE' },
        { reply13: 'BLUE' },
        { reply14: 'BLUE' },
        { reply15: 'BLUE' },
        { reply16: 'RED' },
        { reply17: 'RED' },
        { reply18: 'RED' },
        { reply19: 'RED' },
        { reply20: 'RED' },
    ];
    const choice = answers[Math.floor(Math.random() * answers.length)];
    return reply(command, `${language.reply} \`\`\`css\nQ: ${question}\nA: ${language[Object.keys(choice)[0]]}\`\`\``, Object.values(choice)[0]);
}
module.exports = {
    name: '8ball',
    description: {
        'en_US': 'Ask the 8ball your question~',
        'zh_CN': '问问神奇八号球~',
        'zh_TW': '問問神奇八號球~',
    },
    async execute(message, args, language) {
        await eightBall(message, [args.join(' ')], language);
    },
    slashCommand: {
        data: new SlashCommandBuilder()
            .addStringOption((option) =>
                option.setName('question')
                    .setDescription('Question you would like to ask the 8ball')
                    .setRequired(true)),
        async execute(interaction, language) {
            await eightBall(interaction, [interaction.options.getString('question')], language);
        },
    },
};
