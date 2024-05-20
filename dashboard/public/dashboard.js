const fs = require('fs');
const client = require('../../index');
const dashboardModel = require('../../models/dashboard');
const jwt = require('jsonwebtoken');
const jwt_secret = process.env.JWT_SECRET

module.exports = {
    name: '/dashboard',
    run: async (req, res) => {
        delete require.cache[require.resolve('../html/dashboard.ejs')];

        if(!req.cookies.token) return res.redirect('/login');
        let decoded
        try {
            decoded = jwt.verify(req.cookies.token, jwt_secret);
        } catch (e) {
            console.error(e);
        }

        if(decoded){
            let data = await dashboardModel.findOne({
                _id: decoded.uuid,
                userID: decoded.userID
            });

            let args = {
                avatar: `https://cdn.discordapp.com/avatars/${data.userID}/${data.user.avatar}.png`,
                username: data.user.username,
                discriminator: data.user.discriminator,
                id: data.user.userID,
                loggedIN: true
            }

            res.render('./dashboard/html/dashboard.ejs', args);
        }else {
            res.redirect('/login');
        }
    }
}