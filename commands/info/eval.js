function evalFunc(message, args) {
    const clean = (text) => {
        if (typeof (text) === 'string') {
            return text.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`);
        }
        return text;
    };
    try {
        const code = args.join(' ');
        let evaluated = eval(code);

        if (typeof evaluated !== 'string') {
            evaluated = require('util').inspect(evaluated);
        }

        message.channel.send(clean(evaluated), { code: 'xl' });
    } catch (err) {
        message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
}

module.exports = {
    name: 'eval',
    description: {
        'en_US': 'Evaluate codes!',
        'zh_CN': '执行代码!',
        'zh_TW': '執行代碼!',
    },
    options: [
        {
            name: 'code',
            description: {
                'en_US': 'Code to be evaluated by the me',
                'zh_CN': '让我执行的代码',
                'zh_TW': '讓我執行的代碼',
            },
            type: 'STRING',
            required: true,
        },
    ],
    guildOnly: true,
    ownerOnly: true,
    cooldown: 5,
    execute(message, args, language) {
        evalFunc(message, args, language);
    },
    slashCommand: {
        execute(interaction, language) {
            evalFunc(interaction, [interaction.options.getString('code')], language);
        },
    },
};
