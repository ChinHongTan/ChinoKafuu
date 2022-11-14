import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, TextChannel } from 'discord.js';
import { info, sendSuggestedIllust } from '../../functions/Util.js';
const refreshToken = process.env.PIXIV_REFRESH_TOKEN || require('../../config/config.json').PixivRefreshToken;

async function sendDaily(command: CommandInteraction) {
    if (refreshToken) {
        await info(command, 'Sending...');
        const targetChannel = await command.client.channels.fetch('970590759944335361');
        if (!(targetChannel instanceof TextChannel)) return;
        await sendSuggestedIllust(targetChannel);
        await info(command, 'Done!');
    }
}

export const name = 'send_daily';
export const aliases = ['daily'];
export const coolDown = 3;
export const ownerOnly = true;
export const data = new SlashCommandBuilder()
    .setName('send_daily')
    .setDescription('發送每日圖')
    .setDescriptionLocalizations({
        'en-US': 'Send daily illust manually',
        'zh-CN': '发送每日图',
        'zh-TW': '發送每日圖',
    });
export async function execute(interaction: CommandInteraction) {
    if (!refreshToken)
        return interaction.reply('沒token啦幹');
    await interaction.deferReply();
    await sendDaily(interaction);
}