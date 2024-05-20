const fs = require('node:fs');
const path = require('node:path');
const client = require('../../index');

module.exports = {
    name: '/test',
    run: async (req, res) => {
        delete require.cache[require.resolve('../html/test.ejs')];

        let args = {
            users: client.users.cache.size,
            guilds: client.guilds.cache.size
        }

        res.render('./dashboard/html/test.ejs', args)
    }
};
