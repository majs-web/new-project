
import mongoose from "mongoose";


const certificateSchema = new mongoose.Schema({
    content: { // Define validation rules for each field
        type: String,
        minLength: 5,
        required: true
    },
    important: Boolean,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});
// minLength and required validators are built into Mongoose

// certificateSchema is an object --> should be turned into a string
certificateSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
});

export const Certificate = mongoose.model('Certificate', certificateSchema);