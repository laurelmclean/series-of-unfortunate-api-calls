require('dotenv').config();
const app = require('../server.js');
const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');

const Character = require('../models/character.js');
const Quote = require('../models/quote.js');

chai.config.includeStack = true;

const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

/**
 * root level hooks
 */
after((done) => {
    // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
    mongoose.models = {}
    mongoose.modelSchemas = {}
    mongoose.connection.close();
    done();
});

const SAMPLE_OBJECT_ID = 'aaaaaaaaaaaa' // 12 byte string

describe('Character API endpoints', () => {
    // Create a sample character for use in tests.
    beforeEach((done) => {
        const sampleCharacter = new Character({
            name: 'New Character',
            description: 'New Description',
            _id: SAMPLE_OBJECT_ID
        })
        sampleCharacter.save()
            .then(() => {
                done()
            })
    });

    // Delete sample character.
    afterEach((done) => {
        Character.deleteMany({ name: ['New Character', 'anothercharacter'] })
            .then(() => {
                done()
            })
    })

    it('should load all characters', (done) => {
        chai.request(app)
            .get('/characters')
            .end((err, res) => {
                if (err) { done(err) }
                expect(res).to.have.status(200)
                expect(res.body.characters).to.be.an("array")
                done()
            })
    })

    it('should get one character', (done) => {
        chai.request(app)
            .get(`/characters/${SAMPLE_OBJECT_ID}`)
            .end((err, res) => {
                if (err) { done(err) }
                expect(res).to.have.status(200)
                expect(res.body).to.be.an('object')
                expect(res.body.name).to.equal('New Character')
                done()
            })
    })

    it('should post a new character', (done) => {
        chai.request(app)
            .post('/characters')
            .send({ name: 'anothercharacter', description: 'another description' })
            .end((err, res) => {
                if (err) { done(err) }
                expect(res.body.character).to.be.an('object')
                expect(res.body.character).to.have.property('name', 'anothercharacter')

                // check that character is actually inserted into database
                Character.findOne({ name: 'anothercharacter' }).then(character => {
                    expect(character).to.be.an('object')
                    done()
                })
            })
    })

    it('should update a character', (done) => {
        chai.request(app)
            .put(`/characters/${SAMPLE_OBJECT_ID}`)
            .send({ name: 'anothercharacter' })
            .end((err, res) => {
                if (err) { done(err) }
                expect(res.body.character).to.be.an('object')
                expect(res.body.character).to.have.property('name', 'anothercharacter')

                // check that character is actually inserted into database
                Character.findOne({ name: 'anothercharacter' }).then(character => {
                    expect(character).to.be.an('object')
                    done()
                })
            })
    })

    it('should delete a character', (done) => {
        chai.request(app)
            .delete(`/characters/${SAMPLE_OBJECT_ID}`)
            .end((err, res) => {
                if (err) { done(err) }
                expect(res.body.quote).to.equal('Successfully deleted.')
                expect(res.body._id).to.equal(SAMPLE_OBJECT_ID)

                // check that character is actually deleted from database
                Character.findOne({ name: 'mycharacter' }).then(character => {
                    expect(character).to.equal(null)
                    done()
                })
            })
    })
});