// models/fivemServer.js

const mongoose = require('mongoose');

const fivemServerSchema = new mongoose.Schema({
    ip: {
        type: String,
        required: true,
        unique: true
    },
    port: {
        type: Number,
        required: true
    },
    voteURL: {
        type: String,
        required: false
    },
    guild: {
        type: String,
        required: true
    }
});

const fivemServer = mongoose.model('fivemServer', fivemServerSchema);

module.exports = fivemServer;