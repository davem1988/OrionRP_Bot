const fs = require('node:fs');
const path = require('node:path');
const client = require('../../index');
const { fetchAllModules } = require('../js/getSetModule.js');
const fivemModel = require('../../models/fivemServer.js');

module.exports = {
    name: '/getUserGuilds/:id/modules/',
    run: async (req, res) => {
        delete require.cache[require.resolve('../html/modules.ejs')];

        const guildId = req.params.id;

        try {
            const modules = await fetchAllModules(guildId);
            const guild = client.guilds.cache.get(guildId);

            const server = await fivemModel.findOne({ guild: guildId });


            const updatedModules = modules.map(module => {
                if (!server && (module.name === 'ip' || module.name === 'vote')) {
                    module.active = false;
                }
                return module;
            });

            let args = {
                modules: updatedModules,
                guild: guild
            };

            res.render('./dashboard/html/modules.ejs', args);
        } catch (error) {
            console.error('Error fetching modules:', error);
            res.status(500).send('Internal server error');
        }
    }
};

