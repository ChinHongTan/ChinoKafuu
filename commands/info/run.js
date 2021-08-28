module.exports = {
    name: 'run',
    description: 'Run code snippets with Discord bot!',
    cooldown: 5,
    async execute(message, args, language) {
        const prefix = process.env.PREFIX || require('../../config/config.json').prefix;
        const default_langs = require('../../data/default_langs.json');
        const tio = require('tio.js');
        const hastebin = require('better-hastebin');
        const languages = await tio.languages();

        if (!args) return message.channel.send('Usage: c!run <language> [code](with or without codeblock)');

        const codeLanguage = args.shift();
        let code = message.content.substring(prefix.length + 3 + codeLanguage.length + 1).trim().replace(/^\`+|\`+$/g, '');
        let lang = codeLanguage.replace(/^\`+|\`+$/g, '');
        if (!lang) return message.channel.send('Invalid usage! Invalid language/code.');
        if (/(^ $|^[0-9A-z]*$)/g.test(code.split('\n')[0])) {
            code = code.slice(code.split('\n')[0].length + 1);
        }
        if (!code) return message.channel.send('Invalid usage! Invalid language/code.');
        const quickmap = {
            asm: 'assembly',
            'c#': 'cs',
            'c++': 'cpp',
            csharp: 'cs',
            'f#': 'fs',
            fsharp: 'fs',
            js: 'javascript',
            nimrod: 'nim',
            py: 'python',
            'q#': 'qs',
            rs: 'rust',
            sh: 'bash',
        };
        if (lang in quickmap) lang = quickmap[lang];
        if (lang in default_langs) lang = default_langs[lang];
        if (!languages.includes(lang)) return message.channel.send(':x: | Language not supported!');
        const response = await tio(code, lang, 20000);
        if (response.output.length > 1994 || (response.output.match(/,/g) || []).length > 40) {
            const link = await hastebin(response.output);
            message.channel.send('Your output was too long, but I couldn\'t make an online bin out of it');
            return message.channel.send(`Output was too long (more than 2000 characters or 40 lines) so I put it here: ${link}`);
        }
        console.log(response.output.length);
        if (response.output.length < 1) {
            return message.channel.send('No output!');
        }
        message.channel.send(response.output, { code: true });
    },
};
