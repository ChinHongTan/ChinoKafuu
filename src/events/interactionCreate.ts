import { reply } from '../functions/Util.js';
import { Collection, Interaction, SelectMenuInteraction } from 'discord.js';
import { Command, CustomClient, Translation } from '../../typings/index.js';
const owner_id = process.env.OWNERID || require('../config/config.json').owner_id;

module.exports = {
    name: 'interactionCreate',
    async execute(interaction: Interaction | SelectMenuInteraction, client: CustomClient) {
        // select menus does not contain command name, so customId is used
        // customId should be same as the name of the command
        let command: Command, guildOption: CustomClient["guildCollection"] extends Collection<any, infer I> ? I : never, language: Translation;
        // command = client.commands.get(interaction.customId) ?? client.commands.get(interaction.commandName) 
        // note: I'm not sure why above doesnt work, so I will leave it here first
        if (interaction.isSelectMenu() || interaction.isButton()) {
            command = client.commands.get(interaction.customId);
        };
        if (interaction.isAutocomplete() || interaction.isCommand()) {
            command = client.commands.get(interaction.commandName);
        }
        if (interaction.guild) {
            const guildOption = client.guildCollection.get(interaction?.guild.id);
            language = client.language[guildOption?.data.language ?? 'en-US'][command.name];
        }
        language = client.language['en-US'][command.name];

        if (interaction.isAutocomplete()) {
            if (interaction.responded) return;
            return await command.autoComplete(interaction);
        }
        if (interaction.isSelectMenu()) {
            if (interaction.replied) return;
            return await command.selectMenu(interaction, language);
        }
        if (interaction.isButton()) {
            if (interaction.replied) return;
            return await command.button(interaction, language);
        }
        if (!interaction.isCommand()) return;
        if (command.ownerOnly) {
            if (interaction.user.id !== owner_id) {
                return reply(interaction, { content: 'This command is only available for the bot owner!', ephemeral: true });
            }
        }

        if (command.permissions) {
            const authorPerms = interaction.channel.permissionsFor(interaction.user);
            if (!authorPerms || !authorPerms.has(command.permissions)) {
                return reply(interaction, {
                    content: `You cannot do this! Permission needed: ${command.permissions}`,
                    ephemeral: true,
                });
            }
        }

        if (!command) return;

        // command cool down
        const { coolDowns } = client;

        if (!coolDowns.has(command.name)) {
            coolDowns.set(command.name, new Collection());
        }

        const now = Date.now();
        const timestamps = coolDowns.get(command.name);
        const coolDownAmount = (command.coolDown || 3) * 1000;

        if (timestamps.has(interaction.user.id)) {
            const expirationTime = timestamps.get(interaction.user.id) + coolDownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return interaction.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
            }

            timestamps.set(interaction.user.id, now);
            setTimeout(() => timestamps.delete(interaction.user.id), coolDownAmount);
        }

        try {
            await command.execute(interaction, language);
        } catch (error) {
            console.error(error);
            await reply(interaction, { content: 'There was an error while executing this command!', ephemeral: true });
        }
    },
};
