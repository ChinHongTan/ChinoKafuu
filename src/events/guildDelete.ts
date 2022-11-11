import { deleteGuildData } from "../functions/Util";
import { CustomGuild } from "../../typings";

module.exports = {
    name: 'guildDelete',
    once: true,
    async execute(guild: CustomGuild) {
        // delete info about the guild
        await deleteGuildData(guild.client, guild.id);
    },
};