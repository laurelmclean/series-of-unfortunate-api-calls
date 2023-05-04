const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, select: false },
}, { timestamps: true });

userSchema.pre('save', function (next) {
    // ENCRYPT PASSWORD
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            console.error('Error generating salt:', err);
            return next(err);
        }
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) {
                console.error('Error hashing password:', err);
                return next(err);
            }
            user.password = hash;
            console.log('Password hashed successfully:', user.password);
            next();
        });
    });
});


userSchema.methods.comparePassword = function (password, done) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        done(err, isMatch);
    });
};

module.exports = model('User', userSchema);