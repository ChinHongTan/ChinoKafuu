const { reply } = require('../../functions/commandReply.js');

const inviteLink = 'https://discord.com/api/oauth2/authorize?client_id=958201832528838706&permissions=8&scope=bot%20applications.commands';
async function sendLink(command, language) {
    return reply(command, `${language.invite}\n${inviteLink}`, 'BLUE');
}
module.exports = {
    name: 'invite',
    aliases: ['inv'],
    description: {
        'en_US': 'Get the invitation link of me!',
        'zh_CN': '取得我的邀请链接~',
        'zh_TW': '取得我的邀請鏈接~',
    },
    async execute(message, language) {
        await sendLink(message, language);
    },
    slashCommand: {
        async execute(interaction, language) {
            await sendLink(interaction, language);
        },
    },
};