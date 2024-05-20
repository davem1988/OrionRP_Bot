const { PermissionsBitField } = require('discord.js');
const client = require("../../index");
const schema = require('../../models/dashboard');
const jwt = require('jsonwebtoken');
const jwt_secret = process.env.JWT_SECRET;
const OAuth = require('discord-oauth2');
const oauth = new OAuth();

module.exports = {
    name: "/getUserGuilds/",
    run: async (req, res) => {
        delete require.cache[require.resolve("../html/getUserGuilds.ejs")];

        if (!req.cookies.token) return res.redirect('/login');
        let decoded;
        try {
            decoded = jwt.verify(req.cookies.token, jwt_secret);
        } catch (e) {
            return res.redirect("/login");
        }

        if (!decoded) return res.redirect("/login");

        let data = await schema.findOne({
            _id: decoded.uuid,
            userID: decoded.userID
        });
        if (!data) return res.redirect("/login");

        try {
            let guildArray = await oauth.getUserGuilds(data.access_token);
            let mutualArray = [];
            let nonMutualArray = [];

            guildArray.forEach(g => {
                g.avatar = `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png`;
                const bitPermissions = new PermissionsBitField(BigInt(g.permissions));
                g.hasPerm = bitPermissions.has(PermissionsBitField.Flags.ManageGuild) || 
                            bitPermissions.has(PermissionsBitField.Flags.Administrator) || 
                            client.guilds.cache.get(g.id)?.ownerId == data.userID;

                if (client.guilds.cache.get(g.id)) {
                    mutualArray.push(g);
                } else {
                    nonMutualArray.push(g);
                }
            });

            let args = {
                avatar: `https://cdn.discordapp.com/avatars/${data.userID}/${data.user.avatar}.png`,
                username: data.user.username,
                discriminator: data.user.discriminator,
                id: data.user.userID,
                loggedIN: true,
                mutualGuilds: mutualArray,
                nonMutualGuilds: nonMutualArray
            };

            res.render("./dashboard/html/getUserGuilds.ejs", args);
        } catch (err) {
            if (err.message.includes('401')) {
                // Handle token refresh logic here
                try {
                    const refreshedTokens = await oauth.tokenRequest({
                        clientId: process.env.CLIENT_ID,
                        clientSecret: process.env.CLIENT_SECRET,
                        grantType: 'refresh_token',
                        refreshToken: data.refresh_token,
                        scope: ['identify', 'guilds']
                    });

                    // Update the access token in the database
                    data.access_token = refreshedTokens.access_token;
                    data.refresh_token = refreshedTokens.refresh_token;
                    await data.save();

                    // Retry fetching the guilds with the new token
                    let guildArray = await oauth.getUserGuilds(data.access_token);
                    let mutualArray = [];
                    let nonMutualArray = [];

                    guildArray.forEach(g => {
                        g.avatar = `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png`;
                        const bitPermissions = new PermissionsBitField(BigInt(g.permissions));
                        g.hasPerm = bitPermissions.has(PermissionsBitField.Flags.ManageGuild) || 
                                    bitPermissions.has(PermissionsBitField.Flags.Administrator) || 
                                    client.guilds.cache.get(g.id)?.ownerId == data.userID;

                        if (client.guilds.cache.get(g.id)) {
                            mutualArray.push(g);
                        } else {
                            nonMutualArray.push(g);
                        }
                    });

                    let args = {
                        avatar: `https://cdn.discordapp.com/avatars/${data.userID}/${data.user.avatar}.png`,
                        username: data.user.username,
                        discriminator: data.user.discriminator,
                        id: data.user.userID,
                        loggedIN: true,
                        mutualGuilds: mutualArray,
                        nonMutualGuilds: nonMutualArray
                    };

                    res.render("./dashboard/html/getUserGuilds.ejs", args);
                } catch (refreshErr) {
                    console.error('Failed to refresh token:', refreshErr);
                    return res.redirect('/login');
                }
            } else {
                console.error('Failed to get user guilds:', err);
                return res.redirect('/login');
            }
        }
    }
};
