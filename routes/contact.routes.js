import express from 'express';
import Contact from '../models/contact.model.js';
import Invitation from '../models/invitation.model.js';
import mongoose from 'mongoose';

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
        const contactsWithInvitation = contacts.map(contact => {
            // If originalEmail exists, use that for display instead of potentially modified email
            const displayEmail = contact.originalEmail || contact.email;
            
            return {
                ...contact.toObject(),
                displayEmail,
                invitationSent: invitationMap.get(displayEmail) || invitationMap.get(contact.email) || false
            };
        });

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
        const { vorname, nachname, email, praxis, originalEmail } = req.body;

        // Create contact with all received fields
        const contact = new Contact({
            vorname,
            nachname,
            email,
            praxis,
            // Store original email if provided
            ...(originalEmail && { originalEmail })
        });

        await contact.save();

        // Use the original email for invitation if available
        const invitationEmail = originalEmail || email;
        
        try {
            // Check if invitation already exists - use try/catch instead of query to handle race conditions
            let invitation = new Invitation({
                email: invitationEmail,
                invitationSent: false
            });
            await invitation.save();
        } catch (invErr) {
            // If it fails because invitation already exists, that's okay
            console.log('Note: Invitation may already exist for:', invitationEmail);
        }

        res.status(201).json({
            success: true,
            data: contact
        });

    } catch (error) {
        console.error('Error saving contact:', error);
        
        // Send a more generic error to simplify troubleshooting
        res.status(500).json({
            success: false,
            message: 'Could not save contact. Please try again.'
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