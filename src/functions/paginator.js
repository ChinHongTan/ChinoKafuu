"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class Paginator {
    constructor(embedArray, interaction, ephemeral, fetchReply) {
        this.ephemeral = false;
        this.fetchReply = true;
        this.embedArray = embedArray;
        this.interaction = interaction;
        if (this.ephemeral !== undefined)
            this.ephemeral = ephemeral;
        if (this.fetchReply !== undefined)
            this.fetchReply = fetchReply;
    }
    render(page = 0) {
        const embed = this.embedArray[page];
        const interaction = this.interaction;
        const row = new discord_js_1.MessageActionRow()
            .addComponents(new discord_js_1.MessageButton()
            .setCustomId('button1')
            .setLabel('⏮')
            .setStyle('PRIMARY'))
            .addComponents(new discord_js_1.MessageButton()
            .setCustomId('button2')
            .setLabel('◀️')
            .setStyle('PRIMARY'))
            .addComponents(new discord_js_1.MessageButton()
            .setCustomId('button3')
            .setLabel('▶️')
            .setStyle('PRIMARY'))
            .addComponents(new discord_js_1.MessageButton()
            .setCustomId('button4')
            .setLabel('⏭')
            .setStyle('PRIMARY'));
        return interaction.reply({ embeds: [embed], ephemeral: this.ephemeral, fetchReply: this.fetchReply, components: [row] });
    }
    paginate(interaction, page = 0) {
        switch (interaction.customId) {
            case 'button1':
                page = 0;
                break;
            case 'button2':
                page -= 1;
                break;
            case 'button3':
                page += 1;
                break;
            case 'button4':
                page = this.embedArray.length - 1;
                break;
        }
        return this.render(page);
    }
}
module.exports = Paginator;
//# sourceMappingURL=paginator.js.map