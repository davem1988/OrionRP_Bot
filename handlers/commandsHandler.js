const fs = require('node:fs');
const path = require('node:path');
const { Collection } = require('discord.js')

function loadCommands(client) {
    client.commands = new Collection();
    const commandsPath = path.join(__dirname, '../commands');
    const commandFolders = fs.readdirSync(commandsPath);

    for (const folder of commandFolders) {
        const folderPath = path.join(commandsPath, folder);
        const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const filePath = path.join(folderPath, file);
            const command = require(filePath);

            if (command.data && command.execute) {
                client.commands.set(command.data.name, command);
                console.log(`[SUCCESS] The command: ${command.data.name} is successfully registered`);
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property`);
            }
        }
    }
}   

module.exports = loadCommands;