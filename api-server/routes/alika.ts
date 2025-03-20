import express from 'express';
import * as alikaController from '../controllers/alika-controller.js';
import requireUser from '../middleware/require-user.js';
import validateRequest from '../middleware/validate-request.js';
import { createEventSchema, updateEventSchema, invitationsSchema, mediaLinkSchema, invitationResponseSchema } from '../validation/alika-validation.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// User routes (protected)
router.get('/events', auth, requireUser, (req, res, next) => {
  alikaController.getEvents(req, res).catch(next);
});

router.get('/events/:id', auth, requireUser, (req, res, next) => {
  alikaController.getEvent(req, res).catch(next);
});

router.post('/events', auth, requireUser, validateRequest(createEventSchema), (req, res, next) => {
  alikaController.createEvent(req, res).catch(next);
});

router.put('/events/:id', auth, requireUser, validateRequest(updateEventSchema), (req, res, next) => {
  alikaController.updateEvent(req, res).catch(next);
});

router.delete('/events/:id', auth, requireUser, (req, res, next) => {
  alikaController.deleteEvent(req, res).catch(next);
});

// Invitation routes
router.post('/events/:id/invitations', auth, requireUser, validateRequest(invitationsSchema), (req, res, next) => {
  alikaController.sendInvitations(req, res).catch(next);
});

router.put('/invitations/:id', validateRequest(invitationResponseSchema), (req, res, next) => {
  alikaController.respondToInvitation(req, res).catch(next);
});

// Media routes
router.post('/events/:id/media', auth, requireUser, validateRequest(mediaLinkSchema), (req, res, next) => {
  alikaController.addMediaLink(req, res).catch(next);
});

// Admin routes
router.get('/admin/events', auth, requireUser, (req, res, next) => {
  alikaController.adminGetAllEvents(req, res).catch(next);
});

router.delete('/admin/events/:id', auth, requireUser, (req, res, next) => {
  alikaController.adminDeleteEvent(req, res).catch(next);
});

export default router; 