const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('node:fs');
const express = require('express');
const app = express();
const DiscordOAuth2 = require('discord-oauth2');
const cookieParser = require('cookie-parser');
const path = require('node:path');
const mongoose = require('mongoose');
const moduleRouter = require('./routes/module');
require('dotenv').config();
const token = process.env.TOKEN;
const loadEvents = require('./handlers/eventsHandler');
const loadCommands = require('./handlers/commandsHandler');
const loadButtons = require('./handlers/buttonsHandler');
const loadModals = require('./handlers/modalsHandler');

app.enable('trust proxy');
app.set('etag', false);
app.use(express.static(__dirname + '/dashboard'));
app.use('/getUserGuilds/:guildId/modules', moduleRouter);
app.use('/getUserGuilds/:guildId/modules/:module/config', moduleRouter);
app.use('/getUserGuilds/:guildId/modules/css', express.static(__dirname + '/dashboard/css/', { type: 'text/css' }));
app.use('/getUserGuilds/:guildId/modules/js', express.static(__dirname + '/dashboard/js/', { type: 'application/javascript' }));
app.use('/getUserGuilds/css', express.static(__dirname + '/dashboard/css/', { type: 'text/css' }));
app.use('/getUserGuilds/js', express.static(__dirname + '/dashboard/js/', { type: 'application/javascript' }));
app.set('views', __dirname)
app.set('view engine', 'ejs');
app.use(cookieParser());
process.oauth = new DiscordOAuth2({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: 'http://localhost:8081/callback'
});

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent, 
        GatewayIntentBits.GuildMembers, 
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions,
    ]
});

// Load events and commands
const loadEventsAndCommands = () => {

    loadEvents(client);
    loadCommands(client);
    loadButtons(client);
    loadModals(client);
};

const connectDatabase = () => {
    mongoose.connect(process.env.DATABASE, {
        autoIndex: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4
    }).then(() => { console.log('BOT -> Bot Orion Guard is connected to the DATABASE') })
    .catch(err => { console.error(err)});
}

// Load dashboard request handlers
const loadDashboardHandlers = () => {
    let files = fs.readdirSync('./dashboard/public').filter(f => f.endsWith('.js'));
    files.forEach(f => {
        const file = require(`./dashboard/public/${f}`);
        if (file && file.name) {
            app.get(file.name, file.run);
            console.log(`[Dashboard] - Loaded ${file.name}`);
        }
    });
};

client.once('ready', () => {
    console.log('Bot is ready!');
    loadEventsAndCommands();
    loadDashboardHandlers();
    connectDatabase();

    app.listen(process.env.WEB_PORT || 8081, () => console.log('Web Server listening on port: ' + process.env.WEB_PORT + '\n\n You can access the Dashboard here: http://localhost:8081'));
});

client.login(token).catch(console.error);

module.exports = client;
