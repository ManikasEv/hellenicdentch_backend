import mongoose from 'mongoose';

const invitationSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    invitationSent: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Invitation = mongoose.model('Invitation', invitationSchema);
export default Invitation; 