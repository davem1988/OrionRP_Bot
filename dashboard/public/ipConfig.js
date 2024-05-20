const fs = require('node:fs');
const path = require('node:path');
const client = require('../../index');
const fivemModel = require('../../models/fivemServer');

module.exports = {
    name: '/getUserGuilds/:id/modules/ip/config',
    run: async (req, res) => {
        delete require.cache[require.resolve('../html/ipConfig.ejs')];
        
        const guildId = req.params.id;
        const module = 'ip';
        const guild = client.guilds.cache.get(guildId);
        const serverInfo = await fivemModel.findOne({guild: guildId});
        let IP = 'Not Set';
        let PORT = 'Not Set';

        if(serverInfo){
            IP = serverInfo.ip;
            PORT = serverInfo.port;
        }

        let server = {
            ip: IP,
            port: PORT
        }
        

        let args = {
            module: module,
            guild: guild,
            server: server
        }

        res.render('./dashboard/html/ipConfig.ejs', args);
    }
};