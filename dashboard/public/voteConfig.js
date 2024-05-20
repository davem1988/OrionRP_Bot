const fs = require('node:fs');
const path = require('node:path');
const client = require('../../index');
const fivemModel = require('../../models/fivemServer');

module.exports = {
    name: '/getUserGuilds/:id/modules/vote/config',
    run: async (req, res) => {
        delete require.cache[require.resolve('../html/voteConfig.ejs')];
        
        const guildId = req.params.id;
        const module = 'vote';
        const guild = client.guilds.cache.get(guildId);
        const serverInfo = await fivemModel.findOne({guild: guildId});
        let voteURL = 'Not Set';

        if(serverInfo){
            voteURL = serverInfo.voteURL;
        }

        let server = {
            url: voteURL,
        }
        

        let args = {
            module: module,
            guild: guild,
            server: server
        }

        res.render('./dashboard/html/voteConfig.ejs', args);
    }
};