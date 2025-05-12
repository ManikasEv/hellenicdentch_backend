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
    },
    praxis: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
});

const Contact = mongoose.model('Contact', contactSchema);
export default Contact; 