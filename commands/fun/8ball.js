module.exports = {
    name: "8ball",
    description: true,
    async execute(message) {
        const delay = ms => new Promise(res => setTimeout(res, ms));
        let answers = [
            "It is certain（這是必然）",
            "It is decidedly so（肯定是的）",
            "Without a doubt（不用懷疑）",
            "Yes, definitely（毫無疑問）",
            "You may rely on it（你能依靠它）",
            "As I see it, yes（如我所見，是的）",
            "Most likely（很有可能）",
            "Outlook good（外表很好）",
            "Yes（是的）",
            "Signs point to yes（種種跡象指出「是的」）",
            "Reply hazy try again（回覆攏統，再試試）",
            "Ask again later（待會再問）",
            "Better not tell you now（最好現在不告訴你）",
            "Cannot predict now（現在無法預測）",
            "Concentrate and ask again（專心再問一遍）",
            "Don't count on it（想的美）",
            "My reply is no（我的回覆是「不」）",
            "My sources say no（我的來源說「不」）",
            "Outlook not so good（前景不太好）",
            "Very doubtful（很可疑）"
        ]
        let msg = await message.channel.send({embed: {
            color: "BLUE",
            description: "Asking the 🎱 your question...",
            footer: {
                text: "Please wait...",
            }
        }});
        await delay(Math.floor(Math.random() * 4) * 1000);
        let choice = answers[Math.floor(Math.random() * answers.length)];
        return msg.edit({
			embed: {
				description: `Our 🎱 replied with:\`\`\`css\n${choice}\`\`\``,
				color: "GREEN",
			},
		});
    },
};