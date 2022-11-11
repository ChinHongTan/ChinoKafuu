import { Collection, TextChannel } from 'discord.js';
const channelId = process.env.CHANNEL_ID || require('../config/config.json').channelId;
import util from 'util';
import { getGuildData, saveGuildData } from '../functions/Util.js';
import { CustomClient } from '../../typings/index.js';

module.exports = {
    name: 'ready',
    once: true,
    async execute(client: CustomClient) {
        // when running on heroku, log to discord channel
        if (process.argv[2] === '-r' && channelId) {
            const logChannel = await client.channels.fetch(channelId);
            // check logChannel type
            if (!(logChannel && logChannel instanceof TextChannel)) {
                return console.warn('Channel provided is not a text channel or does not exist!');
            }
            console.log = async function(d: any) {
                await logChannel.send(util.format(d) + '\n');
            };

            console.error = async function(d: any) {
                await logChannel.send(util.format(d) + '\n');
            };
        }

        console.log('Ready!');
        const bot = client.user;
        if (bot) bot.setPresence({
            activities: [{ name: 'c!help', type: 'LISTENING' }],
        });

        client.guildCollection = new Collection();

        await Promise.all(client.guilds.cache.map(async (guild) => {
            const guildData = await getGuildData(client, guild.id);

            // save guild options into a collection
            client.guildCollection.set(guild.id, guildData);

            await saveGuildData(client, guild.id);
        }));
    },
};
