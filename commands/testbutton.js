module.exports = {
    name: "butt",
    cooldown: 3,
    description: "Test button function!",
    execute(message) {
        const client = message.client;
        const disbut = require("discord-buttons")(client);

        let button = new disbut.MessageButton()
            .setStyle("red") //default: blurple
            .setLabel("My First Button!") //default: NO_LABEL_PROVIDED
            .setID("click_to_function") //note: if you use the style "url" you must provide url using .setURL('https://example.com')
            .setDisabled(); //disables the button | default: false

        message.channel.send(
            "Hey, i am powered by https://npmjs.com/discord-buttons",
            button
        );
        client.on("clickButton", async (button) => {
            if (button.id === "click_to_function") {
                button.channel.send(
                    `${button.clicker.user.tag} clicked button!`
                );
            }
        });
    },
};
