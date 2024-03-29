import { CommandInteraction, MessageActionRow, MessageEmbed, MessageButton, ButtonInteraction } from 'discord.js'

class Paginator {
    embedArray: MessageEmbed[];
    interaction: CommandInteraction;
    ephemeral: boolean = false;
    fetchReply: boolean = true;
    constructor(embedArray: MessageEmbed[], interaction: CommandInteraction, ephemeral?: boolean, fetchReply?: boolean) {
        this.embedArray = embedArray;
        this.interaction = interaction;
        if (this.ephemeral !== undefined) this.ephemeral = ephemeral;
        if (this.fetchReply !== undefined) this.fetchReply = fetchReply;
    }

    render(page: number = 0) {
        const embed = this.embedArray[page];
        const interaction = this.interaction;
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('button1')
                    .setLabel('⏮')
                    .setStyle('PRIMARY')
            )
            .addComponents(
                new MessageButton()
                    .setCustomId('button2')
                    .setLabel('◀️')
                    .setStyle('PRIMARY')
            )
            .addComponents(
                new MessageButton()
                    .setCustomId('button3')
                    .setLabel('▶️')
                    .setStyle('PRIMARY')
            )
            .addComponents(
                new MessageButton()
                    .setCustomId('button4')
                    .setLabel('⏭')
                    .setStyle('PRIMARY')
            );
        return interaction.reply({ embeds: [embed], ephemeral: this.ephemeral, fetchReply: this.fetchReply, components: [row] });
    }

    paginate(interaction: ButtonInteraction, page: number = 0) {
        switch (interaction.customId) {
            case 'button1':
                page = 0
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