import * as Discord from 'discord.js';

class CommandReply {
    command: Discord.Message | Discord.CommandInteraction;
    // reply to a user command
    async reply(command: Discord.Message | Discord.CommandInteraction, response: string | Discord.MessageEmbed, color?: Discord.ColorResolvable) {
        if (response instanceof Discord.MessageEmbed) {
            if (command instanceof Discord.Message) return command.channel.send({ embeds: [response] });
            await command.reply({ embeds: [response] });
            return await command.fetchReply();
        }
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
    async edit(command: Discord.Message, embed: Discord.MessageEmbed) {
        return command.edit({ embeds: [embed] });
    }
    async multiReply(command: Discord.Message | Discord.CommandInteraction, response: Discord.MessageEmbed[]) {
        if (command instanceof Discord.Message) return command.channel.send({ embeds: response });
        return command.reply({ embeds: response })
    }
}
module.exports = CommandReply;