import { Message, MessageEmbed, CommandInteraction, ColorResolvable, MessagePayload } from "discord.js";

class CommandReply {
    command: Message | CommandInteraction;
    // reply to a user command
    async reply(command: Message | CommandInteraction, response: string | MessageEmbed, color?: ColorResolvable) {
        if (response instanceof MessageEmbed) {
            if (command instanceof Message) return command.channel.send({ embeds: [response] });
            await command.reply({ embeds: [response] });
            return await command.fetchReply();
        }
        if (command instanceof Message) {
            return command.channel.send({ embeds: [{ description: response, color: color }] });
        }
        await command.reply({ embeds: [{ description: response, color: color }] });
        return await command.fetchReply();
    }
    // reply with a string instead of an embed
    async replyString(command: Message | CommandInteraction, response: string | MessagePayload) {
        if (command instanceof Message) {
            return command.channel.send(response);
        }
        await command.reply(response);
        return await command.fetchReply();
    }
    // edit a message or interaction
    async edit(command: Message | CommandInteraction, response?: MessageEmbed | string, color?: ColorResolvable) {
        if (command instanceof Message) {
            if (response instanceof MessageEmbed) return command.edit({ embeds: [response], components: [], content: '\u200b' });
            return command.edit({ embeds: [{ description: response, color: color }], components: [], content: '\u200b' });
        }
        if (response instanceof MessageEmbed) return command.editReply({ embeds: [response], components: [], content: '\u200b' });
        return command.editReply( { embeds: [{ description: response, color: color }], components: [], content: '\u200b' });
    }
    // reply with multiple embeds
    async multiReply(command: Message | CommandInteraction, response: MessageEmbed[]) {
        if (command instanceof Message) return command.channel.send({ embeds: response });
        return command.reply({ embeds: response })
    }
}
module.exports = CommandReply;