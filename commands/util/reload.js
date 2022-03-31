const { SlashCommandBuilder } = require('@discordjs/builders');

const fs = require('fs');

function reload(interaction, args, user) {
    if (!args.length) return interaction.channel.send(`You didn't pass any command to reload, ${user}!`);
    const commandName = args[0].toLowerCase();
    const command = interaction.client.commands.get(commandName) || interaction.client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return interaction.reply(`There is no command with name or alias \`${commandName}\`, ${user}!`);

    const commandFolders = fs.readdirSync('./commands');
    const folderName = commandFolders.find((folder) => fs.readdirSync(`./commands/${folder}`).includes(`${commandName}.js`));

    delete require.cache[require.resolve(`../${folderName}/${command.name}.js`)];

    try {
        const newCommand = require(`../${folderName}/${command.name}.js`);
        interaction.client.commands.set(newCommand.name, newCommand);
        interaction.reply(`Command \`${command.name}\` was reloaded!`);
    }
    catch (error) {
        console.error(error);
        interaction.reply(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
    }
}
module.exports = {
    name: 'reload',
    description: true,
    args: true,
    ownerOnly: true,
    execute(message, args) {
        reload(message, args, message.author);
    },
    slashCommand: {
        data: new SlashCommandBuilder()
            .addStringOption((option) =>
                option.setName('command')
                    .setDescription('Reload a command')
                    .setRequired(true)),
        execute(interaction, _language) {
            reload(interaction, [interaction.options.getString('command')], interaction.user);
        },
    },
};
