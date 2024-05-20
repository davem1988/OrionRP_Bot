const mongoose = require('mongoose');

const smwSystemSchema = new mongoose.Schema(
    {
        guildId: String,
        question_amount: Number,
        questions: Array,
        answers: Array
    },
    {
        strict: false,
    }
);

module.exports = mongoose.model('smwSystem', smwSystemSchema);