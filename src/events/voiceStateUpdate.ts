import { VoiceChannel, VoiceState } from "discord.js";

module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState: VoiceState, newState: VoiceState) {
        if (newState.member.user.bot) return;
        const mainChannel = oldState.guild.channels.cache.find((channel) => channel.id === '881378732705718292') ?? newState.guild.channels.cache.find((channel) => channel.id === '881378732705718292');
        if (!mainChannel || !(mainChannel instanceof VoiceChannel)) return;
        const channels = mainChannel.parent.children;
        channels.each((channel) => {
            if (channel === mainChannel) return;
            if (channel.members.size < 1) channel.delete();
        });
        const voiceChannel = await newState.guild.channels
            .create(`${newState.member.displayName}的頻道`, {
                type: 'GUILD_VOICE',
                userLimit: 99,
                parent: mainChannel.parent,
            });
        await newState.member.voice.setChannel(voiceChannel);
    },
};
