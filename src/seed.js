const mongoose = require('mongoose');
const Character = require('./models/character');
const Quote = require('./models/quote');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/messages-db', { useNewUrlParser: true, useUnifiedTopology: true });

// Create some quotes
const quotes = [
    new Quote({
        text: 'If you are allergic to a thing, it is best not to put that thing in your mouth, particularly if the thing is cats.',
        book: 'The Reptile Room',
        characterID: '607bce7996b6b73bb9a84579'
    }),
    new Quote({
        text: 'Fate is like a strange, unpopular restaurant filled with odd little waiters who bring you things you never asked for and don\'t always like.',
        book: 'The Slippery Slope',
        characterID: '607bce7996b6b73bb9a8457a'
    }),
    new Quote({
        text: 'I will love you always. When this red hair is white, I will still love you. When the smooth softness of youth is replaced by the delicate softness of age, I will still want to touch your skin. When your face is full of the lines of every smile you have ever smiled, of every surprise I have seen flash through your eyes, when every tear you have ever cried has left its mark upon your face, I will treasure you all the more, because I was there to see it all. I will share your life with you, Meredith, and I will love you until the last breath leaves your body or mine.',
        book: 'The End',
        characterID: '607bce7996b6b73bb9a8457b'
    })
];

// Save the quotes to the database
Promise.all(quotes.map(quote => quote.save()))
    .then(savedQuotes => {
        console.log(`Saved ${savedQuotes.length} quotes.`);

        // Create some characters
        const characters = [
            new Character({
                name: 'Violet Baudelaire',
                description: 'Violet is the eldest of the Baudelaire orphans and an inventor.'
            }),
            new Character({
                name: 'Klaus Baudelaire',
                description: 'Klaus is the middle child of the Baudelaire orphans and a voracious reader.'
            }),
            new Character({
                name: 'Count Olaf',
                description: 'Count Olaf is a treacherous and devious villain who is obsessed with obtaining the Baudelaire fortune.'
            })
        ];

        // Assign the quotes to the characters
        characters[0].quotes.push(savedQuotes[0]._id, savedQuotes[1]._id);
        characters[1].quotes.push(savedQuotes[0]._id, savedQuotes[1]._id);
        characters[2].quotes.push(savedQuotes[2]._id);

        // Save the characters to the database
        Promise.all(characters.map(character => character.save()))
            .then(savedCharacters => {
                console.log(`Saved ${savedCharacters.length} characters.`);
                mongoose.disconnect();
            })
            .catch(error => console.error(error));
    })
    .catch(error => console.error(error));
