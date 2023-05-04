const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CharacterSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
    quotes: [{ type: Schema.Types.ObjectId, ref: "Quote" }]
});

CharacterSchema.pre('findOne', function (next) {
    this.populate('quotes')
    next()
});

CharacterSchema.pre('find', function (next) {
    this.populate('quotes')
    next()
});

const Character = mongoose.model('Character', CharacterSchema);

module.exports = Character;

