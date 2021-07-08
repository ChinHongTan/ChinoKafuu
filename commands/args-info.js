module.exports = {
    name: "args-info",
    description: "Provide information about the argument",
    execute(message, args) {
        if (!args.length) {
            return message.channel.send(
                `You didn't provide any arguments, ${message.author}!`
            );
        } else if (args[0] === "foo") {
            return message.channel.send("bar");
        }

        message.channel.send(
            `Command name: ${message}\nArguments: ${args}\nArgument length: ${args.length}`
        );
    },
};
