const mongoose = require('mongoose');

const ticketSetupSchema = new mongoose.Schema(
    {
        guildId: String,
        feedbackChannelId: String,
        ticketChannelId: String,
        staffRoleId: String,
        ticketType: String,
    },
    {
        strict: false,
    }
);

module.exports = mongoose.model('ticket-setup', ticketSetupSchema);