const express = require('express');
const router = express.Router();

const Character = require('../models/character');

router.get('/', (req, res) => {
    Character.find().then((characters) => {
        return res.json({ characters })
    })
        .catch((err) => {
            throw err.message
        });
});

router.get('/:characterId', (req, res) => {
    console.log(`Character id: ${req.params.characterId}`)
    Character.findById(req.params.characterId).then((character) => {
        return res.json({ character })
    })
        .catch((err) => {
            throw err.message
        });
});

router.post('/', (req, res) => {
    let character = new Character(req.body)
    character.save().then(characterResult => {
        return res.json({ character: characterResult })
    }).catch((err) => {
        throw err.message
    })
});

router.put('/:characterId', (req, res) => {
    Character.findByIdAndUpdate(req.params.characterId, req.body).then((character) => {
        return res.json({ character })
    }).catch((err) => {
        throw err.message
    })
});

router.delete('/:characterId', (req, res) => {
    Character.findByIdAndDelete(req.params.characterId).then(() => {
        return res.json({
            'message': 'Successfully deleted.',
            '_id': req.params.characterId
        })
    })
        .catch((err) => {
            throw err.message
        })
});

module.exports = router;

