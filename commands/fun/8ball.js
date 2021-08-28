module.exports = {
    name: '8ball',
    description: true,
    async execute(message, args, language) {
        if (!args.length > 0) return message.channel.send({ embed: { description: 'Psst. You need to ask the 8ball a question, ya\'know?', color: 'YELLOW' } });
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
        return message.channel.send({
            embed: {
                description: `${language.reply} \`\`\`css\n${language[Object.keys(choice)[0]]}\`\`\``,
                color: Object.values(choice)[0],
            },
        });
    },
};
