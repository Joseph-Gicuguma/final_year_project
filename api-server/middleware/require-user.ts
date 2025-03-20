import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/api-error.js';

const requireUser = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new ApiError(401, 'Unauthorized - Authentication required'));
  }
  
  next();
};

export default requireUser; 