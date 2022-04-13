const { SlashCommandBuilder } = require('@discordjs/builders');
const { reply, edit } = require('../../functions/commandReply.js');
const prefix = process.env.PREFIX || require('../../config/config.json').prefix;
const default_langs = require('../../data/default_langs.json');
const { tio, getLanguages } = require('../../functions/tio.js');
const { MessageEmbed } = require('discord.js');
const axios = require('axios').default;

async function postToHaste(content) {
    const res = await axios.post('https://www.toptal.com/developers/hastebin/documents', content, { headers: { 'Content-Type': 'text/plain' } });
    return `https://www.toptal.com/developers/hastebin/${res.data.key}`;
}
async function getAndReturnResponse(lang, code, command) {
    const languages = await getLanguages();
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
    if (!languages.includes(lang)) return edit(command, ':x: | Language not supported!', 'RED');
    const response = await tio(code, lang, 20000);
    if (response.output.length > 1994 || (response.output.match(/,/g) || []).length > 40) {
        const link = await postToHaste(response.output);
        await edit(command, 'Your output was too long, but I couldn\'t make an online bin out of it', 'YELLOW');
        return edit(command, `Output was too long (more than 2000 characters or 40 lines) so I put it here: ${link}`, 'YELLOW');
    }
    if (response.output.length < 1) {
        return edit(command, 'No output!', 'RED');
    }
    await edit(command, response.output);
}

async function run(command, args, _language) {
    if (!args) return reply(command, 'Usage: c!run <language> [code](with or without codeblock)', 'YELLOW');

    const codeLanguage = args.shift();
    let code = args[0].trim().replace(/^`+|`+$/g, '');
    const lang = codeLanguage.replace(/^`+|`+$/g, '');
    if (!lang) return reply(command, 'Invalid usage! Invalid language/code.', 'RED');
    if (/(^ $|^[0-9A-z]*$)/g.test(code.split('\n')[0])) {
        code = code.slice(code.split('\n')[0].length + 1);
    }
    if (!code) return reply(command, 'Invalid usage! Invalid language/code.', 'RED');
    if (command instanceof MessageEmbed) await command.deferReply();
    else command = await command.channel.send('Please wait...');
    await getAndReturnResponse(lang, code, command);
}

module.exports = {
    name: 'run',
    description: 'Run code snippets with Discord bot!',
    cooldown: 5,
    async execute(message, args, language) {
        const codeLanguage = args.shift();
        await run(message, [codeLanguage, message.content.substring(prefix.length + 3 + codeLanguage.length + 1)], language);
    },
    slashCommand: {
        data: new SlashCommandBuilder()
            .addStringOption((option) => option.setName('language').setDescription('Language used by the code').setRequired(true))
            .addStringOption((option) => option.setName('code').setDescription('Code').setRequired(true)),
        async execute(interaction, language) {
            await run(interaction, [interaction.options.getString('language'), interaction.options.getString('code')], language);
        },
    },
};
