// models/module.js

const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    guild: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    module: {
        type: String,
        required: false
    },
    moduleDescription: {
        type: String,
        required: false
    },
    isModule: {
        type: Boolean,
        required: true
    },
    isConfigurable: {
        type: Boolean,
        required: true
    },
    active: {
        type: Boolean,
        required: true
    }
});

const Module = mongoose.model('Module', moduleSchema);

module.exports = Module;
