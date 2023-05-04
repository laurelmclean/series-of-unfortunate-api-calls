const express = require('express');
const router = express.Router();

const Quote = require('../models/quote');
const Character = require('../models/character');

/** Route to get all quotes. */
router.get('/', (req, res) => {
    Quote.find().then((quotes) => {
        return res.json({ quotes })
    })
        .catch((err) => {
            throw err.message
        });
});

/** Route to get one quote by id. */
router.get('/:quoteId', (req, res) => {
    return res.send(`Quote with id ${req.params.quoteId}`)
});

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
    return res.send({
        message: `Update quote with id ${req.params.quoteId}`,
        data: req.body
    })
});

/** Route to delete a quote. */
router.delete('/:quoteId', (req, res) => {
    return res.send(`Delete quote with id ${req.params.quoteId}`)
});

module.exports = router;