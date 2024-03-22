import express from 'express';
import {
  createEvent,
  deleteEvent,
  deletePoster,
  getManyEvents,
  getOneEventById,
  updateEvent,
  updatePoster,
} from '../controllers/events.js';
import { createSession } from '../controllers/payment.js';
import auth, { optionalAuth } from '../middleware/auth.js';
import { checkUserCompanyRights, checkUserEventRights } from '../middleware/check-rights.js';
import boundary from '../utils/error-boundary.js';
import fileUpload from '../utils/file-upload.js';
import validate from '../utils/validation.js';
import {
  createSchema as createEventSchema,
  ticketSchema,
  updateSchema,
} from '../validation/events.js';

const router = express.Router();

router.get('/', optionalAuth, boundary(getManyEvents));
router.get('/:id', boundary(getOneEventById));

router.use(auth);

router.post('/', validate(createEventSchema), checkUserCompanyRights, boundary(createEvent));
router.put('/:id', checkUserEventRights, validate(updateSchema), boundary(updateEvent));
router.delete('/:id', checkUserEventRights, boundary(deleteEvent));
router.put(
  '/:id/poster',
  checkUserEventRights,
  fileUpload.single('poster'),
  boundary(updatePoster),
);
router.delete('/:id/poster', checkUserEventRights, boundary(deletePoster));

router.post('/:id/subscribe', validate(ticketSchema), boundary(createSession));

export default router;
