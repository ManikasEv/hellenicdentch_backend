import mongoose from 'mongoose';

const invitationSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    invitationSent: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Define a non-unique index on email field
invitationSchema.index({ email: 1 }, { unique: false });

const Invitation = mongoose.model('Invitation', invitationSchema);
export default Invitation; 