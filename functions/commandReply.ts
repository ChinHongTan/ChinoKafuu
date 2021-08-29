import * as Discord from 'discord.js';
class CommandReply {
    command: Discord.Message | Discord.CommandInteraction;
    constructor(command: Discord.Message | Discord.CommandInteraction) {
        this.command = command;
    }
    // reply to a user command
    reply(command: Discord.Message | Discord.CommandInteraction, response: string, color: Discord.ColorResolvable) {
        if (typeof(command) === typeof(Discord.Message)) {
            return command.channel.send({
                embeds: [{
                    description: response,
                    color: color
                }]
            })
        }
        if (typeof(command) === typeof(Discord.CommandInteraction)) {
            return command.reply({
                embeds: [{
                    description: response,
                    color: color
                }]
            })
        }
    }
}
module.exports = CommandReply;