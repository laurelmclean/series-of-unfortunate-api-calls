const express = require('express')
const router = express.Router();

const Quote = require('../models/quote')
const Character = require('../models/character')

/** Route to get all quotes. */
router.get('/', (req, res) => {
    Quote.find().then((quotes) => {
        return res.json({ quotes })
    })
        .catch((err) => {
            throw err.quote
        });
})

/** Route to get one quote by id. */
router.get('/:quoteId', (req, res) => {
    Quote.findById(req.params.quoteId)
        .then(quote => {
            return res.json(quote)
        })
        .catch(err => {
            throw err.quote
        })
})

/** Route to add a new quote. */
router.post('/', (req, res) => {
    let quote = new Quote(req.body)
    quote.save()
        .then(quote => {
            return Character.findById(quote.characterID)
        })
        .then(character => {
            console.log(character)
            character.quotes.unshift(quote)
            return character.save()
        })
        .then(_ => {
            return res.send(quote)
        }).catch(err => {
            throw err.message
        })
});

/** Route to update an existing quote. */

router.put('/:quoteId', (req, res) => {
    const { body } = req.body;
    Quote.findByIdAndUpdate(req.params.quoteId, { body }, { new: true })
        .then((updatedQuote) => {
            return res.json({ quote: updatedQuote });
        })
        .catch((err) => {
            return res.status(500).json({ error: err.quote });
        });
});

/** Route to delete a quote. */
router.delete('/:quoteId', (req, res) => {
    Quote.findByIdAndDelete(req.params.quoteId).then(() => {
        return res.json({
            'quote': 'Quote Successfully deleted.',
            '_id': req.params.characterId
        })
    })
        .catch((err) => {
            throw err.quote
        })
})

module.exports = router;