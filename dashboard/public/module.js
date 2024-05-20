const fs = require('fs');
const path = require('path');
const client = require('../../index');
const { fetchAllModuleCommands } = require('../js/getSetModule.js');

module.exports = {
    name: '/getUserGuilds/:id/modules/:module',
    run: async (req, res) => {
        try {

            const moduleName = req.params.module;
            const guild = client.guilds.cache.get(req.params.id);
            const guildId = req.params.id;

            const modules = await fetchAllModuleCommands(guildId, moduleName);

            const args = {
                moduleName: moduleName,
                modules: modules,
                guild: guild
            };

            res.render(path.join(__dirname, '../html/module.ejs'), args);
        } catch (error) {
            console.error('Error rendering module:', error);
            res.status(500).send('Internal server error');
        }
    }
};
