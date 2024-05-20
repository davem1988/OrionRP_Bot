const fs = require('node:fs');
const path = require('node:path');
const client = require('../../index');
const fivemModel = require('../../models/fivemServer');

module.exports = {
    name: '/getUserGuilds/:id/modules/registerserver/config',
    run: async (req, res) => {
        delete require.cache[require.resolve('../html/registerserverConfig.ejs')];
        
        const guildId = req.params.id;
        const module = 'serverregister';
        const guild = client.guilds.cache.get(guildId);
        const serverInfo = await fivemModel.findOne({guild: guildId});
        let IP = 'Not Set';
        let PORT = 'Not Set';
        let URL = 'Not Set';

        if(serverInfo){
            IP = serverInfo.ip;
            PORT = serverInfo.port;
            URL = serverInfo.voteURL;
        }

        let server = {
            ip: IP,
            port: PORT,
            url: URL
        }
        

        let args = {
            module: module,
            guild: guild,
            server: server
        }

        res.render('./dashboard/html/registerserverConfig.ejs', args);
    }
};