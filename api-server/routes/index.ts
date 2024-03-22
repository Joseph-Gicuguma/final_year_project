import express from 'express';
import auth from './auth.js';
import companies from './companies.js';
import events from './events.js';
import users from './users.js';
import comments from './comments.js';
import promoCodes from './promo-codes.js';
import formats from './formats.js';
import themes from './themes.js';
import profile from './profile.js';
import userCompanies from './user-companies.js';

const router = express.Router();

router.use('/auth', auth);
router.use('/companies', companies);
router.use('/events', events);
router.use('/users', users);
router.use('/comments', comments);
router.use('/promo-codes', promoCodes);
router.use('/formats', formats);
router.use('/themes', themes);
router.use('/me/companies', userCompanies);
router.use('/me/profile', profile);

export default router;
