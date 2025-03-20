import express from 'express';
import { 
  createEvent, 
  getEvent, 
  sendInvitations, 
  updateRsvp, 
  addMediaLink 
} from '../controllers/alikaController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

// Protected routes
router.post('/events', authenticate, createEvent);
router.get('/events/:id', authenticate, getEvent);
router.post('/events/:eventId/invitations', authenticate, sendInvitations);
router.put('/invitations/:invitationId/rsvp', updateRsvp);
router.post('/events/:eventId/media', authenticate, addMediaLink);

export default router; 