/*

const { saveGuildData, error, success } = require('../../functions/Util');
const { MessageEmbed, Util } = require('discord.js');

async function ar(command, args) {
    const [subcommandGroup, subcommand, ...options] = args;
    const guildData = command.client.guildCollection.get(command.guild.id).data;
    switch (subcommandGroup) {
    case 'character': {
        switch (subcommand) {
        case 'add': {
            return error(command, '暫時還不支持此功能！');
        }
        case 'remove': {
            return error(command, '暫時還不支持此功能！');
        }
        case 'list': {
            return error(command, '暫時還不支持此功能！');
        }
        }
        break;
    }
    case 'respond': {
        const autoResponse = guildData.autoResponse ?? {};
        switch (subcommand) {
        case 'add': {
            const message = command.options?.getString('message') ?? options[0];
            const reply = command.options?.getString('reply') ?? options[1];
            if (!(message in autoResponse)) autoResponse[message] = [reply];
            if (!autoResponse[message].includes(reply)) autoResponse[message].push(reply);
            guildData.autoResponse = autoResponse;
            await success(command, `已添加自動回復！\n觸發詞：${message}\n回復：${reply}`);
            return await saveGuildData(command.client, command.guild.id);
        }
        case 'remove': {
            const message = command.options?.getString('message') ?? options[0];
            const reply = command.options?.getString('reply') ?? options[1];
            const index = autoResponse[message].indexOf(reply);
            if (index > -1) autoResponse[message].splice(index, 1);
            if (!autoResponse[message].length) delete autoResponse[message];
            await success(command, `已移除自動回復！\n觸發詞：${message}\n回復：${reply}`);
            return await saveGuildData(command.client, command.guild.id);
        }
        case 'list': {
            const message = command.options?.getString('message') ?? options[0];
            let replies = '';
            autoResponse[message].forEach((reply, index) => {
                replies += `${index + 1}. ${reply}\n`;
            });
            return new MessageEmbed()
                .setTitle(`Replies invoked by ${message}`)
                .setColor('BLURPLE')
                .setDescription(Util.escapeMarkdown(replies));
        }
        }
    }
    }
}
module.exports = {
    name: 'auto-respond',
    aliases: ['ar'],
    guildOnly: true,
    description: {
        'en-US': 'Auto responding a message',
        'zh-CN': '自动回复讯息',
        'zh-TW': '自動回復訊息',
    },
    subcommandGroups: [
        {
            name: 'character',
            description: {
                'en-US': '.',
                'zh-CN': '.',
                'zh-TW': '.',
            },
            subcommands: [
                {
                    name: 'add',
                    description: {
                        'en-US': '.',
                        'zh-CN': '.',
                        'zh-TW': '.',
                    },
                    options: [
                        {
                            name: 'avatar',
                            description: {
                                'en-US': '.',
                                'zh-CN': '.',
                                'zh-TW': '.',
                            },
                            type: 'STRING',
                            required: true,
                        },
                        {
                            name: 'name',
                            description: {
                                'en-US': '.',
                                'zh-CN': '.',
                                'zh-TW': '.',
                            },
                            type: 'STRING',
                        },
                    ],
                },
                {
                    name: 'remove',
                    description: {
                        'en-US': '.',
                        'zh-CN': '.',
                        'zh-TW': '.',
                    },
                    options: [
                        {
                            name: 'name',
                            description: {
                                'en-US': '.',
                                'zh-CN': '.',
                                'zh-TW': '.',
                            },
                            type: 'STRING',
                        },
                    ],
                },
                {
                    name: 'list',
                    description: {
                        'en-US': '.',
                        'zh-CN': '.',
                        'zh-TW': '.',
                    },
                    options: [
                        {
                            name: 'name',
                            description: {
                                'en-US': '.',
                                'zh-CN': '.',
                                'zh-TW': '.',
                            },
                            type: 'STRING',
                        },
                    ],
                },
            ],
        },
        {
            name: 'respond',
            description: {
                'en-US': '.',
                'zh-CN': '.',
                'zh-TW': '.',
            },
            subcommands: [
                {
                    name: 'add',
                    description: {
                        'en-US': '.',
                        'zh-CN': '.',
                        'zh-TW': '.',
                    },
                    options: [
                        {
                            name: 'message',
                            description: {
                                'en-US': '.',
                                'zh-CN': '.',
                                'zh-TW': '.',
                            },
                            type: 'STRING',
                            required: true,
                        },
                        {
                            name: 'reply',
                            description: {
                                'en-US': '.',
                                'zh-CN': '.',
                                'zh-TW': '.',
                            },
                            type: 'STRING',
                            required: true,
                        },
                    ],
                },
                {
                    name: 'remove',
                    description: {
                        'en-US': '.',
                        'zh-CN': '.',
                        'zh-TW': '.',
                    },
                    options: [
                        {
                            name: 'message',
                            description: {
                                'en-US': '.',
                                'zh-CN': '.',
                                'zh-TW': '.',
                            },
                            type: 'STRING',
                            required: true,
                        },
                        {
                            name: 'reply',
                            description: {
                                'en-US': '.',
                                'zh-CN': '.',
                                'zh-TW': '.',
                            },
                            type: 'STRING',
                            required: true,
                        },
                    ],
                },
                {
                    name: 'list',
                    description: {
                        'en-US': '.',
                        'zh-CN': '.',
                        'zh-TW': '.',
                    },
                },
            ],
        },
    ],
    async execute(message, args, language) {
        await ar(message, args, language);
    },
    slashCommand: {
        async execute(interaction, language) {
            await ar(interaction, [interaction.getSubcommandGroup(), interaction.getSubcommand()], language);
        },
    },
};

*/

// will work on this later