
async function activateCommand(commandName, guildId) {
    try {
        const response = await fetch(`http://localhost:8081/getUserGuilds/${guildId}/modules/activate/${commandName}/${guildId}`, {
            method: 'POST',
            // Optionally, you can include headers or a request body if needed
        });

        if (response.ok) {
            // Command activated successfully
            const data = await response.json();
            console.log(data.message);
        } else {
            // Handle errors
            console.error('Failed to activate command:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error activating command:', error.message);
    }
}

// Example frontend code to deactivate a command
async function deactivateCommand(commandName, guildId) {
    console.log('Deactivating command:', commandName)
    try {
        const response = await fetch(`http://localhost:8081/getUserGuilds/${guildId}/modules/deactivate/${commandName}/${guildId}`, {
            method: 'POST',
            // Optionally, you can include headers or a request body if needed
        });

        if (response.ok) {
            // Command deactivated successfully
            const data = await response.json();
            console.log(data.message);
        } else {
            // Handle errors
            console.error('Failed to deactivate command:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error deactivating command:', error.message);
    }
}

// Function to fetch all modules
async function fetchAllModules(guildId) {
    const client = require('../../index');
    try {
        const response = await fetch(`http://localhost:8081/getUserGuilds/${guildId}/modules/getmodules/${guildId}`);
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                // Modules fetched successfully
                let modules = data.modules;

                // Check if the number of commands in client.commands matches the number of modules
                if (modules.length !== client.commands.size) {
                    // Register any new commands as modules
                    const newModules = await registerBotCommands(guildId);
                    modules = [...modules, ...newModules];
                }

                return modules;
                // You can further process the modules here as needed
            } else {
                // Handle failure response
                console.error('Failed to fetch modules:', data.message);
            }
        } else {
            // Handle HTTP error response
            console.error('Failed to fetch modules:', response.status, response.statusText);
        }
    } catch (error) {
        // Handle network error or other exceptions
        console.error('Error fetching modules:', error.message);
    }
}

async function fetchAllModuleCommands(guildId, module) {
    const client = require('../../index');
    try {
        const response = await fetch(`http://localhost:8081/getUserGuilds/${guildId}/modules/getcommands/${guildId}/${module}`);
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                // Modules fetched successfully
                let modules = data.modules;

                // Check if the number of commands in client.commands matches the number of modules
                if (modules.length !== client.commands.size) {
                    // Register any new commands as modules
                    const newModules = await registerBotCommands(guildId);
                    modules = [...modules, ...newModules];
                }

                return modules;
                // You can further process the modules here as needed
            } else {
                // Handle failure response
                console.error('Failed to fetch module commands:', data.message);
            }
        } else {
            // Handle HTTP error response
            console.error('Failed to fetch module commands:', response.status, response.statusText);
        }
    } catch (error) {
        // Handle network error or other exceptions
        console.error('Error fetching modules:', error.message);
    }
}

// Function to register all bot commands as modules
async function registerBotCommands(guildId) {
    const client = require('../../index');
    const Module = require('../../models/module');
    const guild = guildId
    try {
        // Assuming you have a collection of all bot commands with descriptions
        const botCommands = client.commands;

        // Find existing module names to avoid duplicates
        const existingModules = await Module.find({ guild: guild }).select('name');
        const existingModuleNames = existingModules.map(mod => mod.name);

        // Keep track of module names already registered
        const registeredModuleNames = new Set();

        // Register each bot command as a module, if not already registered
        const newModules = [];
        for (const [commandName, command] of botCommands) {
            if (!existingModuleNames.includes(commandName)) {
                if (command.module) {
                    const module = new Module({
                        name: commandName,
                        description: command.description || 'No description provided',
                        guild: guild,
                        module: command.module,
                        moduleDescription: command.moduleDescription,
                        isModule: false,
                        active: true,
                        isConfigurable: command.isConfigurable
                    });

                    if(!registeredModuleNames.has(command.module)){
                        const moduleModule = new Module({
                            name: command.module,
                            description: command.moduleDescription || 'No description provided',
                            guild: guild,
                            isModule: true,
                            active: true,
                            isConfigurable: false
                        });

                        newModules.push(await moduleModule.save());
                        registeredModuleNames.add(command.module);
                    }

                    newModules.push(await module.save());
                    
                } else {
                    const module = new Module({
                        name: commandName,
                        description: command.description || 'No description provided',
                        guild: guild,
                        isModule: false,
                        active: true,
                        isConfigurable: command.isConfigurable
                    });

                    newModules.push(await module.save());
                }
            }
        }

        return newModules;
    } catch (error) {
        console.error('Error registering bot commands as modules:', error);
        return []; // Return an empty array if registration fails
    }
}

async function updateServerIPPort(guildId, module, ip, port) {
    try {
        const response = await fetch(`http://localhost:8081/getUserGuilds/${guildId}/modules/${module}/config/updateServer/${guildId}/ip?ip=${ip}&port=${port}`, {
            method: 'POST',

        });

        if (response.ok) {
            // Server IP and port updated successfully
            const data = await response.json();
            console.log(data.message);
            return {ip, port}
        } else {
            // Handle errors
            console.error('Failed to update server IP and port:', response.status, response.statusText);
            return false
        }
    } catch (error) {
        console.error('Error updating server IP and port:', error.message);
        return false
    }
}

async function updateServerVoteURL(guildId, module, url) {
    try {
        const response = await fetch(`http://localhost:8081/getUserGuilds/${guildId}/modules/${module}/config/updateServer/${guildId}/vote?url=${url}`, {
            method: 'POST',

        });

        if (response.ok) {
            // Server IP and port updated successfully
            const data = await response.json();
            console.log(data.message);
            return {url}
        } else {
            // Handle errors
            console.error('Failed to update server vote URL:', response.status, response.statusText);
            return false
        }
    } catch (error) {
        console.error('Error updating server vote URL:', error.message);
        return false
    }
}

async function updateServerInfo(guildId, module, ip, port, url) {
    try {
        const response = await fetch(`http://localhost:8081/getUserGuilds/${guildId}/modules/${module}/config/updateServer/${guildId}/server?ip=${ip}&port=${port}&url=${url}`, {
            method: 'POST',

        });

        if (response.ok) {
            // Server IP and port updated successfully
            const data = await response.json();
            console.log(data.message);
            return {ip, port, url}
        } else {
            // Handle errors
            console.error('Failed to update server IP and port:', response.status, response.statusText);
            return false
        }
    } catch (error) {
        console.error('Error updating server IP and port:', error.message);
        return false
    }
}


module.exports = { fetchAllModules, fetchAllModuleCommands, deactivateCommand, activateCommand, updateServerIPPort, updateServerVoteURL, updateServerInfo};

