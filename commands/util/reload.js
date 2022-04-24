const { success, error } = require('../../functions/Util.js');
const fs = require('fs');

async function reload(interaction, args, user) {
    if (!args.length) return error(interaction, `You didn't pass any command to reload, ${user}!`);
    const commandName = args[0].toLowerCase();
    const command = interaction.client.commands.get(commandName) || interaction.client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return error(interaction, `There is no command with name or alias \`${commandName}\`, ${user}!`);

    const commandFolders = fs.readdirSync('./commands');
    const folderName = commandFolders.find((folder) => fs.readdirSync(`./commands/${folder}`).includes(`${commandName}.js`));

    delete require.cache[require.resolve(`../${folderName}/${command.name}.js`)];

    try {
        const newCommand = require(`../${folderName}/${command.name}.js`);
        await interaction.client.commands.set(newCommand.name, newCommand);
        return success(interaction, `Command \`${command.name}\` was reloaded!`);
    } catch (err) {
        console.error(err);
        return error(interaction, `There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
    }
}
module.exports = {
    name: 'reload',
    description: {
        'en_US': 'Reloads a command',
        'zh_CN': '重新加载指令',
        'zh_TW': '重新加載指令',
    },
    options: [
        {
            name: 'command',
            description: {
                'en_US': 'Command to reload',
                'zh_CN': '重新加载的指令',
                'zh_TW': '重新加載的指令',
            },
            type: 'STRING',
            required: true,
        },
    ],
    args: true,
    ownerOnly: true,
    async execute(message, args) {
        await reload(message, args, message.author);
    },
    slashCommand: {
        async execute(interaction) {
            await reload(interaction, [interaction.options.getString('command')], interaction.user);
        },
    },
};
