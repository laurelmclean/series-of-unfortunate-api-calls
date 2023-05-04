const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuoteSchema = new Schema({
    text: { type: String, required: true },
    book: { type: String, required: false },
    characterID: { type: Schema.Types.ObjectId, ref: "Character", required: true },
});

const Quote = mongoose.model('Quote', QuoteSchema);

module.exports = Quote;