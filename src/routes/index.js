const express = require('express');
const quoteRoutes = require('./quote.js');
const characterRoutes = require('./character.js');
const authRoutes = require('./auth.js');

const router = express.Router();

router.use('/quotes', quoteRoutes);
router.use('/characters', characterRoutes);
router.use('/auth', authRoutes);

router.use('/auth/sign-up', authRoutes);

module.exports = router;