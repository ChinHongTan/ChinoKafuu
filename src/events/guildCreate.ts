import { getGuildData, saveGuildData } from "../functions/Util";

import { CustomGuild } from "../../typings";

module.exports = {
    name: 'guildCreate',
    once: true,
    async execute(guild: CustomGuild) {
        // initialize guildData and save it into database
        const guildData = await getGuildData(guild.client, guild.id);
        guild.client.guildCollection.set(guild.id, guildData);
        await saveGuildData(guild.client, guild.id);
    },
};