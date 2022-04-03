import { Message, MessageEmbed, CommandInteraction, ColorResolvable, MessageOptions } from "discord.js";

function isString(x: any): x is string {
    return typeof x === "string";
}

class CommandReply {
    // reply to a user command
    async reply(command: Message | CommandInteraction, response: string | MessageEmbed | MessageOptions, color?: ColorResolvable) {
        if (response instanceof MessageEmbed) {
            if (command instanceof Message) return command.reply({ embeds: [response] });
            await command.reply({ embeds: [response] });
            return await command.fetchReply();
        } else if (isString(response)) {
            if (command instanceof Message) {
                return command.reply({ embeds: [{ description: response, color: color }] });
            }
            await command.reply({ embeds: [{ description: response, color: color }] });
            return await command.fetchReply();
        }
        if (command instanceof Message) return command.reply(response);
        await command.reply(response);
        return await command.fetchReply();
    }

    // edit a message or interaction
    async edit(command: Message | CommandInteraction, response?: MessageEmbed | string | MessageOptions, color?: ColorResolvable) {
        if (command instanceof Message) {
            if (response instanceof MessageEmbed) return await command.edit({ embeds: [response], components: [], content: '\u200b' });
            else if (isString(response)) return await command.edit({ embeds: [{ description: response, color: color }], components: [], content: '\u200b' });
            return await command.edit(response);
        }
        if (response instanceof MessageEmbed) return await command.editReply({ embeds: [response], components: [], content: '\u200b' });
        else if (isString(response)) return await command.editReply( { embeds: [{ description: response, color: color }], components: [], content: '\u200b' });
        return await command.editReply(response);
    }
    // reply with multiple embeds
    async multiReply(command: Message | CommandInteraction, response: MessageEmbed[]) {
        if (command instanceof Message) return await command.channel.send({ embeds: response });
        return await command.reply({ embeds: response })
    }
}
module.exports = CommandReply;