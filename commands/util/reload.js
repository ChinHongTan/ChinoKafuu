const { success, error } = require('../../functions/Util.js');
const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');

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
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('重新加載指令')
        .setDescriptionLocalizations({
            'en-US': 'Reloads a command',
            'zh-CN': '重新加载指令',
            'zh-TW': '重新加載指令',
        })
        .addStringOption((option) => option
            .setName('command')
            .setDescription('重新加載的指令')
            .setDescriptionLocalizations({
                'en-US': 'Command to reload',
                'zh-CN': '重新加载的指令',
                'zh-TW': '重新加載的指令',
            })
            .setRequired(true),
        ),
    args: true,
    ownerOnly: true,
    async execute(interaction) {
        await reload(interaction, [interaction.options.getString('command')], interaction.user);
    },
};
