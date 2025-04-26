import express from 'express';
import Contact from '../models/contact.model.js';
import Invitation from '../models/invitation.model.js';

const router = express.Router();

// @route   GET /api/contacts
// @desc    Get all contacts with invitation status
// @access  Public
router.get('/', async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        const invitations = await Invitation.find();
        
        // Create a map of email to invitation status
        const invitationMap = new Map(invitations.map(inv => [inv.email, inv.invitationSent]));
        
        // Combine contact data with invitation status
        const contactsWithInvitation = contacts.map(contact => ({
            ...contact.toObject(),
            invitationSent: invitationMap.get(contact.email) || false
        }));

        res.status(200).json({
            success: true,
            data: contactsWithInvitation
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
});

// @route   POST /api/contacts
// @desc    Create a new contact
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { vorname, nachname, email, praxis } = req.body;

        // Check if contact with email already exists
        const existingContact = await Contact.findOne({ email });
        if (existingContact) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Create new contact
        const contact = await Contact.create({
            vorname,
            nachname,
            email,
            praxis
        });

        // Create invitation record with default false
        await Invitation.create({
            email,
            invitationSent: false
        });

        res.status(201).json({
            success: true,
            data: contact
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
});

// @route   PUT /api/contacts/invitation/:email
// @desc    Toggle invitation status
// @access  Public
router.put('/invitation/:email', async (req, res) => {
    try {
        const { email } = req.params;
        
        let invitation = await Invitation.findOne({ email });
        
        if (!invitation) {
            invitation = await Invitation.create({
                email,
                invitationSent: true
            });
        } else {
            invitation.invitationSent = !invitation.invitationSent;
            await invitation.save();
        }

        res.status(200).json({
            success: true,
            data: invitation
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
});

export default router; 