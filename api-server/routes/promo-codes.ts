import express from 'express';
import {
  getPromoCodes,
  getPromoCodeById,
  updatePromoCode,
  deletePromoCode,
  createPromoCode,
} from '../controllers/promo-codes.js';
import boundary from '../utils/error-boundary.js';
import auth from '../middleware/auth.js';
import validate from '../utils/validation.js';
import { updateSchema, getPromoCodesSchema, createSchema } from '../validation/promo-codes.js';
import { checkUserEventRights, checkUserPromoCodeRights } from '../middleware/check-rights.js';

const router = express.Router();

router.use(auth);

router.get('/', validate(getPromoCodesSchema, 'query'), boundary(getPromoCodes));
router.post('/', validate(createSchema), checkUserEventRights, boundary(createPromoCode));
router.get('/:id', checkUserPromoCodeRights, boundary(getPromoCodeById));
router.put('/:id', checkUserPromoCodeRights, validate(updateSchema), boundary(updatePromoCode));
router.delete('/:id', checkUserPromoCodeRights, boundary(deletePromoCode));

export default router;
