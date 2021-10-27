const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const commandReply = new CommandReply();
const { CommandInteraction, Message } = require('discord.js');
function eball(command, args, language) {
    if (!args[0]) return commandReply.reply(command, 'Psst. You need to ask the 8ball a question, ya\'know?', 'YELLOW');
    let question;
    if (command instanceof CommandInteraction) question = args[0];
    if (command instanceof Message) question = args.join(' ');
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
    commandReply.reply(command, `${language.reply} \`\`\`css\nQ: ${question}\nA: ${language[Object.keys(choice)[0]]}\`\`\``, Object.values(choice)[0]);
}
module.exports = {
    name: '8ball',
    description: true,
    async execute(message, args, language) {
        eball(message, args, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder()
            .addStringOption((option) =>
                option.setName('question')
                    .setDescription('Qeustion you would like to ask the 8ball')
                    .setRequired(true)),
        async execute(interaction, language) {
            eball(interaction, [interaction.options.getString('question')], language);
        },
    },
};
