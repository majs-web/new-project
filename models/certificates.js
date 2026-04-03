
import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
});

// certificateSchema is an object --> should be turned into a string
/* certificateSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
}); */

export const Certificate = mongoose.model('Certificate', certificateSchema);