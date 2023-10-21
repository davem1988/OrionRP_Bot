require("dotenv").config();


const { REST, Routes } = require("discord.js");
const {
    CLIENT_ID: clientId,
    GUILD_ID: guildId,
    TOKEN: token,
} = process.env;
const fs = require("node:fs");
const commands = [];

// Function to recursively load command files from a directory
function loadCommandsFromDirectory(directory) {
    const commandFiles = fs.readdirSync(directory).filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
        const command = require(`./${directory}/${file}`);
        if (command.data) {
            commands.push(command.data.toJSON());
        }
    }

    const subdirectories = fs.readdirSync(directory, { withFileTypes: true }).filter((dirent) => dirent.isDirectory());
    for (const subdir of subdirectories) {
        loadCommandsFromDirectory(`${directory}/${subdir.name}`);
    }
}

// Load commands from all subdirectories of "commands"
loadCommandsFromDirectory("commands");

// Construct and prepare an instance of the REST module
const rest = new REST({ version: "10" }).setToken(token);
 
// and deploy your commands!
(async () => {
    try {
        console.log(
            `Started refreshing ${commands.length} application (/) commands.`
        );
 
        // The put method is used to fully refresh all commands in the guild with the current set
        await rest.put(
            Routes.applicationCommands(clientId),
            { body: []}
        );
        const data = await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands }
        );
 
        console.log(
            `Successfully reloaded ${data.length} application (/) commands.`
        );
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();