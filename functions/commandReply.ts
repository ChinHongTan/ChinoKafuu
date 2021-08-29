import * as Discord from 'discord.js';
class CommandReply {
    command: Discord.Message | Discord.CommandInteraction;
    constructor(command: Discord.Message | Discord.CommandInteraction) {
        this.command = command;
    }
    // reply to a user command
    reply(command: Discord.Message | Discord.CommandInteraction, response: string | Discord.MessageEmbed, color: Discord.ColorResolvable) {
        if (response instanceof Discord.MessageEmbed) {
            if (command instanceof Discord.Message) return command.channel.send({ embeds: [response] });
            return command.reply({ embeds: [response] });
        }
        if (command instanceof Discord.Message) {
            return command.channel.send({
                embeds: [{
                    description: response,
                    color: color
                }]
            });
        }
        return command.reply({
            embeds: [{
                description: response,
                color: color
            }]
        });
    }
}
module.exports = CommandReply;