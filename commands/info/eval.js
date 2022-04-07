const { SlashCommandBuilder } = require('@discordjs/builders');

function evalFunc(message, args, _language) {
    const clean = (text) => {
        if (typeof (text) === 'string') {
            return text.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`);
        }
        return text;
    };
    try {
        const code = args.join(' ');
        let evaled = eval(code);

        if (typeof evaled !== 'string') {
            evaled = require('util').inspect(evaled);
        }

        message.channel.send(clean(evaled), { code: 'xl' });
    } catch (err) {
        message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
}

module.exports = {
    name: 'eval',
    description: true,
    guildOnly: true,
    ownerOnly: true,
    cooldown: 5,
    execute(message, args, language) {
        evalFunc(message, args, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder()
            .addStringOption((option) =>
                option.setName('code')
                    .setDescription('Code to be evaled by the bot')
                    .setRequired(true)),
        execute(interaction, language) {
            evalFunc(interaction, [interaction.options.getString('code')], language);
        },
    },
};
