import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 40
    },
    date: {
        type: Date, 
        required: true
    },
    content: { 
        type: String, 
        required: true,
        maxlength: 300
    },
    slug: String,
    important: Boolean,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

// NB: Used ChatGPT to figure out how to create this function
// Turns the certificate name input into a slug
certificateSchema.pre('save', async function () {
    if (!this.slug) {
        this.slug = this.name
            .toLowerCase()
            .trim()
            .replace(/[\s\W-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
});

certificateSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
}); 

export const Certificate = mongoose.model('Certificate', certificateSchema);