const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// SIGN UP
router.get('/sign-up', (req, res) => res.render('sign-up'));

// SIGN UP POST
router.post('/sign-up', async (req, res) => {
    try {
        // Create User
        const user = new User(req.body);
        await user.save();

        // Create JWT token
        const token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: '60 days' });
        // Set cookie
        res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
        res.sendStatus(200);
    } catch (err) {
        if (err.name === 'MongoError' && err.code === 11000) {
            // Duplicate key error - username already taken
            console.error('Username already taken:', err);
            return res.status(409).send('Username already taken');
        }
        console.error('Error during sign-up:', err);
        res.status(500).send('Internal Server Error');
    }
});


// LOGOUT
router.get('/logout', (req, res) => {
    res.clearCookie('nToken');
    res.sendStatus(200);
    res.redirect('/');
});

// LOGIN
router.get('/login', (req, res) => res.render('login'));

// LOGIN
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Find this user name
        const user = await User.findOne({ username }, 'username password');
        if (!user) {
            // User not found
            console.error('User not found');
            return res.status(401).send({ message: 'Wrong Username or Password' });
        }
        // Check the password
        user.comparePassword(password, (err, isMatch) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).send('Internal Server Error');
            }
            if (!isMatch) {
                // Password does not match
                console.error('Password does not match');
                return res.status(401).send({ message: 'Wrong Username or password' });
            }
            // Create a token
            const token = jwt.sign({ _id: user._id, username: user.username }, process.env.SECRET, {
                expiresIn: '60 days',
            });
            // Set a cookie and send the response
            res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
            return res.sendStatus(200);
        });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send('Internal Server Error');
    }
});

// GET all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        console.error('Error retrieving users:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
