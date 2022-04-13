import { Message, MessageEmbed, CommandInteraction, ColorResolvable, MessageOptions } from "discord.js";

function isString(x: any): x is string {
    return typeof x === "string";
}

// reply to a user command
async function reply(command: Message | CommandInteraction, response: string | MessageOptions, color?: ColorResolvable) {
    if (isString(response)) {
        if (command instanceof Message) {
            return command.reply({ embeds: [{ description: response, color: color }] });
        }
        if (command.deferred) {
            await command.editReply({ embeds: [{ description: response, color: color }] });
            return await command.fetchReply();
        }
        await command.reply({ embeds: [{ description: response, color: color }] });
        return await command.fetchReply();
    }
    if (command instanceof Message) return command.reply(response);
    if (command.deferred) return await command.editReply(response);
    await command.reply(response);
    return await command.fetchReply();
}

// edit a message or interaction
async function edit(command: Message | CommandInteraction, response?: MessageEmbed | string | MessageOptions, color?: ColorResolvable) {
    if (command instanceof Message) {
        if (response instanceof MessageEmbed) return await command.edit({ embeds: [response], components: [], content: '\u200b' });
        else if (isString(response)) return await command.edit({ embeds: [{ description: response, color: color }], components: [], content: '\u200b' });
        return await command.edit(response);
    }
    if (response instanceof MessageEmbed) return await command.editReply({ embeds: [response], components: [], content: '\u200b' });
    else if (isString(response)) return await command.editReply( { embeds: [{ description: response, color: color }], components: [], content: '\u200b' });
    return await command.editReply(response);
}

module.exports = { reply, edit };