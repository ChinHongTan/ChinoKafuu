import { GuildChannel } from 'discord.js';
import { CustomClient, CustomMessage } from '../../typings/index.js';
import { addUserExp, getUserData, saveGuildData } from '../functions/Util.js';

module.exports = {
    name: 'messageCreate',
    async execute(message: CustomMessage, client: CustomClient) {
        if (message.author.bot) return;

        if (message.guild && message.channel instanceof GuildChannel) {
            const guildData = client.guildCollection.get(message.guild.id).data;
            const userData = guildData.users.find((user) => user.id === message.member.id) ??
                await getUserData(message.client, message.member);
            await saveGuildData(client, message.guild.id); // save in collection cache
            if (!('expAddTimestamp' in userData) || userData.expAddTimestamp + 60 * 1000 <= Date.now()) {
                await addUserExp(client, message.member);
            }
            const autoResponse = guildData.autoResponse;
            if (autoResponse && message.cleanContent in autoResponse) {
                const channelWebhooks = await message.channel.fetchWebhooks();
                const responseWebhook = channelWebhooks
                    .find(webhook => webhook.name === 'autoResponse' && webhook.owner === client.user) ??
                    await message.channel.createWebhook('autoResponse', { avatar: client.user.avatarURL() });
                return responseWebhook.send({
                    content: autoResponse[message.cleanContent][Math.floor(Math.random() * autoResponse[message.cleanContent].length)],
                    username: client.user.username,
                    avatarURL: client.user.avatarURL({ format: 'png', dynamic: true }),
                });
            }
        }
    },
};
