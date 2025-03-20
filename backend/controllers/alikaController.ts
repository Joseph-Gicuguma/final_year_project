import { Request, Response } from 'express';
import { db } from '../config/database';

// Create a new event
export const createEvent = async (req: Request, res: Response) => {
  try {
    const { title, description, date, time, location } = req.body;
    const hostId = req.user.id; // Assuming you have authentication middleware
    
    // Create event in database
    const event = await db.events.create({
      title,
      description,
      date,
      time,
      location,
      hostId,
      isActive: true
    });
    
    return res.status(201).json({ success: true, event });
  } catch (error) {
    console.error('Error creating event:', error);
    return res.status(500).json({ success: false, message: 'Failed to create event' });
  }
};

// Get event details
export const getEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await db.events.findById(id);
    
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    
    // Get invitations for this event
    const invitations = await db.invitations.findByEventId(id);
    
    // Get media links
    const mediaLinks = await db.media.findByEventId(id);
    
    return res.status(200).json({ success: true, event, invitations, mediaLinks });
  } catch (error) {
    console.error('Error fetching event:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch event details' });
  }
};

// Send invitations
export const sendInvitations = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const { guests } = req.body; // Array of {email, name}
    
    const event = await db.events.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    
    // Check if user is event host
    if (event.hostId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    // Create invitations
    const invitations = await Promise.all(
      guests.map(guest => db.invitations.create({
        eventId,
        guestEmail: guest.email,
        guestName: guest.name,
        status: 'pending'
      }))
    );
    
    // Here you would also send notification emails
    
    return res.status(201).json({ success: true, invitations });
  } catch (error) {
    console.error('Error sending invitations:', error);
    return res.status(500).json({ success: false, message: 'Failed to send invitations' });
  }
};

// Update RSVP status
export const updateRsvp = async (req: Request, res: Response) => {
  try {
    const { invitationId } = req.params;
    const { status } = req.body;
    
    if (!['accepted', 'declined', 'maybe'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    
    const invitation = await db.invitations.findById(invitationId);
    if (!invitation) {
      return res.status(404).json({ success: false, message: 'Invitation not found' });
    }
    
    // Update invitation status
    const updatedInvitation = await db.invitations.update(invitationId, { status });
    
    return res.status(200).json({ success: true, invitation: updatedInvitation });
  } catch (error) {
    console.error('Error updating RSVP:', error);
    return res.status(500).json({ success: false, message: 'Failed to update RSVP' });
  }
};

// Add media link
export const addMediaLink = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const { type, url, title } = req.body;
    
    const event = await db.events.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    
    // Check if user is event host
    if (event.hostId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    // Create media link
    const media = await db.media.create({
      eventId,
      type,
      url,
      title
    });
    
    return res.status(201).json({ success: true, media });
  } catch (error) {
    console.error('Error adding media link:', error);
    return res.status(500).json({ success: false, message: 'Failed to add media link' });
  }
}; 