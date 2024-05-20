const fs = require('node:fs');
const path = require('node:path');
const { Collection } = require('discord.js')

function loadButtons(client) {
    client.buttons = new Collection();
    const buttonsPath = path.join(__dirname, '../buttons');
    const buttonFolders = fs.readdirSync(buttonsPath);

    for (const folder of buttonFolders) {
        const folderPath = path.join(buttonsPath, folder);
        const buttonFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

        for (const file of buttonFiles) {
            const filePath = path.join(folderPath, file);
            const button = require(filePath);

            if (button.name && button.execute) {
                client.buttons.set(button.name, button);
                console.log(`[SUCCESS] The button: ${button.name} is successfully registered`);
            } else {
                console.log(`[WARNING] The button at ${filePath} is missing a required "data" or "execute" property`);
            }
        }
    }
}   

module.exports = loadButtons;