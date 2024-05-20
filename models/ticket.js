const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
    {
        guildId: String,
        ticketMemberId: String,
        ticketChannelId: String,
        parentTicketChannelId: String,
        rating: Number,
        feedback: String,
        closed: Boolean,
        membersAdded: Array
    },
    {
        strict: false,
    }
);

module.exports = mongoose.model('ticket', ticketSchema);