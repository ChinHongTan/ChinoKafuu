module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState) {
        if (newState.member.user.bot) return;
        const mainChannel = oldState.guild.channels.cache.find((channel) => channel.id === '881378732705718292');
        if (mainChannel) {
            const channels = mainChannel.parent.children;
            channels.each((channel) => {
                if (channel.id === '881378732705718292') return;
                if (channel.members.size < 1) channel.delete();
            });
        }
        if (newState.channelId === '881378732705718292') {
            const voiceChannel = await newState.guild.channels
                .create(`${newState.member.displayName}的頻道`, {
                    type: 'GUILD_VOICE',
                    userLimit: 99,
                    parent: newState.guild.channels.cache.find(
                        (channel) => channel.id === '881378732705718292',
                    ).parent,
                });
            await newState.member.voice.setChannel(voiceChannel);
        }
    },
};
