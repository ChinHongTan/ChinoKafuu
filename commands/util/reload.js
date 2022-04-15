const { SlashCommandBuilder } = require('@discordjs/builders');
const { reply } = require('../../functions/commandReply.js');
const fs = require('fs');

async function reload(interaction, args, user) {
    if (!args.length) return reply(interaction, `You didn't pass any command to reload, ${user}!`, 'RED');
    const commandName = args[0].toLowerCase();
    const command = interaction.client.commands.get(commandName) || interaction.client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return reply(interaction, `There is no command with name or alias \`${commandName}\`, ${user}!`, 'RED');

    const commandFolders = fs.readdirSync('./commands');
    const folderName = commandFolders.find((folder) => fs.readdirSync(`./commands/${folder}`).includes(`${commandName}.js`));

    delete require.cache[require.resolve(`../${folderName}/${command.name}.js`)];

    try {
        const newCommand = require(`../${folderName}/${command.name}.js`);
        await interaction.client.commands.set(newCommand.name, newCommand);
        return reply(interaction, `Command \`${command.name}\` was reloaded!`, 'GREEN');
    } catch (error) {
        console.error(error);
        return reply(interaction, `There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``, 'RED');
    }
}
module.exports = {
    name: 'reload',
    description: {
        'en_US': 'Reloads a command',
        'zh_CN': '重新加载指令',
        'zh_TW': '重新加載指令',
    },
    args: true,
    ownerOnly: true,
    async execute(message, args) {
        await reload(message, args, message.author);
    },
    slashCommand: {
        data: new SlashCommandBuilder()
            .addStringOption((option) =>
                option.setName('command')
                    .setDescription('Reload a command')
                    .setRequired(true)),
        async execute(interaction) {
            await reload(interaction, [interaction.options.getString('command')], interaction.user);
        },
    },
};
