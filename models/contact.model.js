import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    vorname: {
        type: String,
        required: true,
    },
    nachname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: false,
    },
    praxis: {
        type: String,
        required: true,
    },
    // Add fields to support duplicate email registrations
    originalEmail: {
        type: String,
        required: false,
    },
    uniqueId: {
        type: String,
        required: false,
    }
}, {
    timestamps: true
});

const Contact = mongoose.model('Contact', contactSchema);
export default Contact; 