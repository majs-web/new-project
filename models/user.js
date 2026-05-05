
import mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail.js';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email'],
        maxlength: 254
    },
    username: {
        type: String,
        required: [true, 'Please enter a username'],
        unique: true,
        maxlength: 50
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum password length is 6 characters'],
        maxlength: 200
    },
    certificates: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Certificate'
        }
    ]
});

// function for before document saved to db
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
});

// static message to login user
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('incorrect password');
    };
    throw Error('incorrect email');
};

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject._v;
        delete returnedObject.password;
    }
});

export const User = mongoose.model('user', userSchema);