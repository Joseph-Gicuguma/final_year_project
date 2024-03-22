import express from 'express';
import { uploadPhoto } from '../controllers/profile.js';
import {
  createUser,
  deleteUser,
  deleteUserAvatar,
  getMany,
  getUser,
  updateUser,
  updateUserAvatar,
} from '../controllers/users.js';
import adminAuth from '../middleware/admin-auth.js';
import auth, { optionalAuth } from '../middleware/auth.js';
import boundary from '../utils/error-boundary.js';
import validate from '../utils/validation.js';
import { adminUpdateSchema, createSchema } from '../validation/user.js';

const router = express.Router();

router.get('/:id', boundary(getUser));
router.get('/', optionalAuth, boundary(getMany));

router.use(auth, adminAuth);

router.post('/', validate(createSchema), boundary(createUser));
router.put('/:id', validate(adminUpdateSchema), boundary(updateUser));
router.delete('/:id', boundary(deleteUser));

router.put('/:id/avatar', boundary(uploadPhoto), boundary(updateUserAvatar));
router.delete('/:id/avatar', boundary(deleteUserAvatar));

export default router;
