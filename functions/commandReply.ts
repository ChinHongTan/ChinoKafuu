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
}
module.exports = CommandReply;