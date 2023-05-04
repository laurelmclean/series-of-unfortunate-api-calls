const express = require('express');
const quoteRoutes = require('./quote.js');
const characterRoutes = require('./character.js');

const router = express.Router();

router.use('/quotes', quoteRoutes);
router.use('/characters', characterRoutes);

module.exports = router;