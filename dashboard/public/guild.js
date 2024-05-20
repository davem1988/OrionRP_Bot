const { PermissionsBitField } = require('discord.js');
const client = require("../../index");
const schema = require('../../models/dashboard');
const jwt = require('jsonwebtoken');
const jwt_secret = process.env.JWT_SECRET;

module.exports = {
    name: "/getUserGuilds/:id",
    run: async (req, res) => {
        // delete cache
        delete require.cache[require.resolve("../html/guild.ejs")];

        // Check if the URL has the guild ID parameter
        if (!req.params.id) {
            return res.redirect('/getUserGuilds');
        }

        // Check if the bot is in the guild
        const guildId = req.params.id;
        if (!client.guilds.cache.has(guildId)) {
            return res.redirect('/getUserGuilds');
        }



        // login check
        if (!req.cookies.token) {
            return res.redirect('/login');
        }

        let decoded;
        try {
            decoded = jwt.verify(req.cookies.token, jwt_secret);
        } catch (e) {}
        if (!decoded) {
            return res.redirect("/login");
        }

        // getting data
        let data = await schema.findOne({
            _id: decoded.uuid,
            userID: decoded.userID
        });

        // if no data redirect to login
        if (!data) {
            return res.redirect("/login");
        }
        let guild = client.guilds.cache.get(guildId); // Fallback to using guildId from URL
      
        if (!guild) {
            return res.redirect('/getUserGuilds');
        }
        const member = await guild.members.fetch(data.userID);
        if (!member) {
            return res.redirect('/getUserGuilds');
        }

        const bitPermissions = new PermissionsBitField(BigInt(member.permissions));
        if (!member.permissions.has('MANAGE_GUILD') && !member.permissions.has('ADMINISTRATOR') && client.guilds.cache.get(guild.id).ownerId == data.userID) {
            return res.redirect('/getUserGuilds');
        }
        
        let args = {
            avatar: `https://cdn.discordapp.com/avatars/${data.userID}/${data.user.avatar}.png`,
            username: data.user.username,
            discriminator: data.user.discriminator,
            id: data.user.userID,
            guild: guild,
            bitPermissions: bitPermissions
        };

        res.render("./dashboard/html/guild.ejs", args);
    }
};
