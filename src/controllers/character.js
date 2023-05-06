const express = require('express');
const router = express.Router();
const Character = require('../models/character');

/** Route to get all characters. */
router.get('/', (req, res) => {
    Character.find().then((characters) => {
        return res.json({ characters })
    })
        .catch((err) => {
            throw err.quote
        });
});

/** Route to get one character by id. */
router.get('/:characterId', (req, res) => {
    Character.findOne({ _id: req.params.characterId })
        .then(result => {
            res.json(result)
        }).catch(err => {
            throw err.quote
        })
});

/** Route to add a new  */
router.post('/', (req, res) => {
    let character = new Character(req.body)
    character.save().then(characterResult => {
        return res.json({ character: characterResult })
    }).catch((err) => {
        throw err.quote
    })
});

/** Route to update an existing character. */
router.put('/:characterId', (req, res) => {
    Character.findByIdAndUpdate(req.params.characterId, req.body).then(() => {
        return Character.findOne({ _id: req.params.characterId })
    }).then((character) => {
        return res.json({ character })
    }).catch((err) => {
        throw err.quote
    })
});

/** Route to delete a character. */
router.delete('/:characterId', (req, res) => {
    Character.findByIdAndDelete(req.params.characterId).then((result) => {
        if (result === null) {
            return res.json({ quote: 'Character does not exist.' })
        }
        return res.json({
            'quote': 'Successfully deleted.',
            '_id': req.params.characterId
        })
    })
        .catch((err) => {
            throw err.quote
        })
});

module.exports = router;