const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const FuzzySort = require('../../functions/fuzzysort.js');
const commandReply = new CommandReply();
const { MessageEmbed } = require('discord.js');

function avatar(command, args, language) {
    const fuzzysort = new FuzzySort(command);
    if (args.length < 1) {
        // display author's avatar
        const embed = new MessageEmbed()
            .setTitle(language.yourAvatar)
            .setColor('RANDOM')
            .setImage(`${command.author.displayAvatarURL({
                format: 'png',
                dynamic: true,
                size: 2048,
            })}`);
        return commandReply.reply(command, embed);
    }

    // check if an id is provided
    const user = command.guild.members.cache.find((member) => member.user.id === args[0]);
    // if id exists
    if (user) {
        const embed = new MessageEmbed()
            .setTitle(language.memberAvatar.replace('${user.displayName}', user.displayName))
            .setColor(user.displayHexColor)
            .setImage(
                `${user.user.displayAvatarURL({
                    format: 'png',
                    dynamic: true,
                    size: 2048,
                })}`,
            );
        return commandReply.reply(command, embed);
    }

    // perform a fuzzy search based on the keyword given
    const keyword = command.content.substr(command.content.indexOf(' ') + 1);
    const member = fuzzysort.search(keyword);
    if (!member) {
        return commandReply.reply(command, language.noMember.replace('${keyword}', keyword), 'RED');
    }

    const embed = new MessageEmbed()
        .setTitle(language.memberAvatar.replace('${user.displayName}', member.displayName))
        .setColor(member.displayHexColor)
        .setImage(`${member.user.displayAvatarURL({
            format: 'png',
            dynamic: true,
            size: 2048,
        })}`);
    commandReply.reply(command, embed);
}
module.exports = {
    name: 'avatar',
    cooldown: 10,
    aliases: ['icon', 'pfp', 'av'],
    guildOnly: true,
    description: true,
    execute(message, args, language) {
        if (message.mentions.users.size) {
            // display all user's avatars mentioned by the author
            const avatarList = message.mentions.users.map((user) => {
                return new MessageEmbed()
                    .setTitle(language.userAvatar.replace('${user.username}', user.username))
                    .setColor('RANDOM')
                    .setImage(`${user.displayAvatarURL({
                        format: 'png',
                        dynamic: true,
                        size: 2048,
                    })}`);
            });

            // send the entire array of embed to the channel
            avatarList.forEach((embed) => {
                commandReply.reply(message, embed);
            });
        }
        else {
            avatar(message, args, language);
        }
    },
    slashCommand: {
        data: new SlashCommandBuilder()
            .addUserOption((option) => option.setName('member').setDescription('member\'s avatar')),
        async execute(interaction, language) {
            const user = interaction.options.getMember('member') ?? interaction.member;
            const embed = new MessageEmbed()
                .setTitle(language.memberAvatar.replace('${user.displayName}', user.displayName))
                .setColor(user.displayHexColor)
                .setImage(
                    `${user.user.displayAvatarURL({
                        format: 'png',
                        dynamic: true,
                        size: 2048,
                    })}`,
                );
            return commandReply.reply(interaction, embed);
        },
    },
};
