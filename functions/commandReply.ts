import * as Discord from 'discord.js';

class CommandReply {
    command: Discord.Message | Discord.CommandInteraction;
    // reply to a user command
    async reply(command: Discord.Message | Discord.CommandInteraction, response: string | Discord.MessageEmbed | Discord.MessageEmbed[], color?: Discord.ColorResolvable) {
        if (!Array.isArray(response) && response instanceof Discord.MessageEmbed) response = [response];

        if (response instanceof Discord.MessageEmbed && Array.isArray(response)) {
            if (command instanceof Discord.Message) return command.channel.send({ embeds: response });
            await command.reply({ embeds: response });
            return await command.fetchReply();
        }
        if (!Array.isArray(response)){
            if (command instanceof Discord.Message) {
                return command.channel.send({
                    embeds: [{
                        description: response,
                        color: color
                    }]
                });
            }
            await command.reply({
                embeds: [{
                    description: response,
                    color: color
                }]
            });
            return await command.fetchReply();
        }
    }
    async edit(command: Discord.Message, embed: Discord.MessageEmbed | Discord.MessageEmbed[]) {
        if (!Array.isArray(embed)) embed = [embed];
        return command.edit({ embeds: embed });
    }
}
module.exports = CommandReply;