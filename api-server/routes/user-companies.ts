import express from 'express';
import { subscribeToCompany, unsubscribeFromCompany } from '../controllers/user-companies.js';
import auth from '../middleware/auth.js';
import boundary from '../utils/error-boundary.js';

const router = express.Router();

router.use(auth);

router.post('/:id', boundary(subscribeToCompany));
router.delete('/:id', boundary(unsubscribeFromCompany));

export default router;
