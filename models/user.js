
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: String,
    passwordHash: String,
    certificates: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Certificate'
        }
    ],
});

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        if (returnedObject._id) {
            returnedObject.id = returnedObject._id.toString()
        }
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
});

export const User = mongoose.model('User', userSchema);