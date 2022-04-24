const { reply, error } = require('../../functions/Util.js');
const FuzzySort = require('../../functions/fuzzysort.js');
const { MessageEmbed } = require('discord.js');

function avatar(command, args, language) {
    const fuzzySort = new FuzzySort(command);
    if (args.length < 1) {
        // display author's avatar
        const embed = new MessageEmbed()
            .setTitle(language.yourAvatar)
            .setColor('RANDOM')
            .setImage(command.author.displayAvatarURL({
                format: 'png',
                dynamic: true,
                size: 2048,
            }));
        return reply(command, { embeds: [embed] });
    }

    // check if an id is provided
    const user = command.guild.members.cache.find((member) => member.user.id === args[0]);
    // if id exists
    if (user) {
        const embed = new MessageEmbed()
            .setTitle(language.memberAvatar.replace('${user.displayName}', user.displayName))
            .setColor(user.displayHexColor)
            .setImage(user.user.displayAvatarURL({
                format: 'png',
                dynamic: true,
                size: 2048,
            }));
        return reply(command, { embeds: [embed] });
    }

    // perform a fuzzy search based on the keyword given
    const keyword = command.content.substring(command.content.indexOf(' ') + 1);
    const member = fuzzySort.search(keyword);
    if (!member) {
        return error(command, language.noMember.replace('${keyword}', keyword));
    }

    const embed = new MessageEmbed()
        .setTitle(language.memberAvatar.replace('${user.displayName}', member.displayName))
        .setColor(member.displayHexColor)
        .setImage(member.user.displayAvatarURL({
            format: 'png',
            dynamic: true,
            size: 2048,
        }));
    return reply(command, { embeds: [embed] });
}
module.exports = {
    name: 'avatar',
    coolDown: 10,
    aliases: ['icon', 'pfp', 'av'],
    guildOnly: true,
    description: {
        'en_US': 'Send user avatar.',
        'zh_CN': '发送用户头像',
        'zh_TW': '發送用戶頭像',
    },
    options: [
        {
            name: 'member',
            description: {
                'en_US': 'member\'s avatar, will send your avatar if no arguments given',
                'zh_CN': '群员的头像，如果没有指明群员，我将会发送你的头像',
                'zh_TW': '群員的頭像，如果没有指明群员，我将会发送你的头像',
            },
            type: 'USER',
        },
    ],
    async execute(message, args, language) {
        if (message.mentions.users.size) {
            // display all user's avatars mentioned by the author
            const avatarList = message.mentions.users.map((user) => {
                return new MessageEmbed()
                    .setTitle(language.userAvatar.replace('${user.username}', user.username))
                    .setColor('RANDOM')
                    .setImage(user.displayAvatarURL({
                        format: 'png',
                        dynamic: true,
                        size: 2048,
                    }));
            });

            // send the entire array of embed to the channel
            avatarList.forEach((embed) => {
                reply(message, { embeds: [embed] });
            });
        } else {
            return avatar(message, args, language);
        }
    },
    slashCommand: {
        async execute(interaction, language) {
            const user = interaction.options.getMember('member') ?? interaction.member;
            const embed = new MessageEmbed()
                .setTitle(language.memberAvatar.replace('${user.displayName}', user.displayName))
                .setColor(user.displayHexColor)
                .setImage(user.user.displayAvatarURL({
                    format: 'png',
                    dynamic: true,
                    size: 2048,
                }));
            return reply(interaction, { embeds: [embed] });
        },
    },
};
