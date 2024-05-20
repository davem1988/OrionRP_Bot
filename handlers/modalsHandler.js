const fs = require('node:fs');
const path = require('node:path');
const { Collection } = require('discord.js')

function loadModals(client) {
    client.modals = new Collection();
    const modalsPath = path.join(__dirname, '../modals');
    const modalFolders = fs.readdirSync(modalsPath);

    for (const folder of modalFolders) {
        const folderPath = path.join(modalsPath, folder);
        const modalFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

        for (const file of modalFiles) {
            const filePath = path.join(folderPath, file);
            const modal = require(filePath);

            if (modal.name && modal.execute) {
                client.modals.set(modal.name, modal);
                console.log(`[SUCCESS] The modal: ${modal.name} is successfully registered`);
            } else {
                console.log(`[WARNING] The modal at ${filePath} is missing a required "data" or "execute" property`);
            }
        }
    }
}   

module.exports = loadModals;