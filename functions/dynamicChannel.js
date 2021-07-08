module.exports = {
    name: "dynamic",
    func: function (oldState, newState) {
        if (newState.member.user.bot) return;
        let mainChannel = oldState.guild.channels.cache.find(
            (channel) => channel.id === "860456123953840128"
        );
        if (mainChannel) {
            let channels = mainChannel.parent.children;
            channels.each((channel) => {
                if (channel.id === "860456123953840128") return;
                if (channel.members.size < 1) {
                    channel.delete();
                }
            });
        }
        if (newState.channelID === "860456123953840128") {
            newState.guild.channels
                .create(`${newState.member.displayName}的頻道`, {
                    type: "voice",
                    bitrate: 256000,
                    userLimit: 99,
                    parent: newState.guild.channels.cache.find(
                        (channel) => channel.id === "860456123953840128"
                    ).parent,
                })
                .then((voiceChannel) => {
                    newState.member.voice.setChannel(voiceChannel);
                });
        }
    },
};
