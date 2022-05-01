const { reply, getUserData } = require('../../functions/Util');
const { MessageEmbed } = require('discord.js');

async function level(command, member) {
    let userData = command.client.guildCollection.get(member.guild.id).data.users.find((user) => user.id === member.id);
    if (!userData) userData = await getUserData(command.client, member);
    const userExp = userData.exp;
    const userLevel = userData.level;
    const expNeeded = userLevel * ((1 + userLevel) / 2) + 4;
    return new MessageEmbed()
        .setAuthor({
            name: member.displayName,
            iconURL: member.user.displayAvatarURL({ format: 'png', dynamic: true }),
        })
        .setColor('BLURPLE')
        .addField('Level', '' + userLevel, true)
        .addField('Exp', '' + userExp + '/' + '' + expNeeded, true);
}

module.exports = {
    name: 'level',
    coolDown: 3,
    description: {
        'en_US': 'Get a member\'s level',
        'zh_CN': '显示成员的等级',
        'zh_TW': '顯示成員的等級',
    },
    options: [
        {
            name: 'member',
            description: {
                'en_US': 'member\'s level, will send your level if no arguments given',
                'zh_CN': '群员的等级，如果没有指明群员，我将会发送你的等级',
                'zh_TW': '群員的等級，如果没有指明群员，我将会发送你的等級',
            },
            type: 'USER',
        },
    ],
    async execute(message) {
        if (!message.mentions.members.size) {
            const embed = await level(message, message.member);
            return reply(message, { embeds: [embed] });
        }

        const userInfoList = message.mentions.members.map((user) => {
            return new Promise((resolve, reject) => {
                level(message, user)
                    .then((embed) => {
                        return resolve(embed);
                    })
                    .catch((err) => {
                        reject(`Error: ${err}`);
                    });
            });
        });
        const embeds = await Promise.all(userInfoList);
        return reply(message, { embeds: embeds });
    },
    slashCommand: {
        async execute(interaction) {
            const user = interaction.options.getMember('member');
            if (!user) {
                return reply(interaction, { embeds: [await level(interaction, interaction.member)] });
            }
            return reply(interaction, { embeds: [await level(interaction, user)] });
        },
    },
};