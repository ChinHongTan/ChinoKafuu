module.exports = {
    name: 'eval',
    description: true,
    guildOnly: true,
    ownerOnly: true,
    cooldown: 5,
    execute(message, args) {
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
        }
        catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
        }
    },
};
