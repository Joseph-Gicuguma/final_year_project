import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import multer, { StorageEngine, FileFilterCallback } from 'multer';
import { DIR_UPLOADS_NAME } from '../consts/default.js';
import ClientError from '../types/error.js';
import logger from '../lib/logger.js';

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

const FILE_FORMATS = ['image/png', 'image/jpg', 'image/jpeg'];

const fileFilter = (
  req: Request, 
  file: Express.Multer.File, 
  callback: FileFilterCallback
): void => {
  if (FILE_FORMATS.includes(file.mimetype)) {
    callback(null, true);
  } else {
    const error = new ClientError(
      `The file format should be one of: ${FILE_FORMATS.join(', ')}`,
      400
    );
    callback(error);
  }
};

// ✅ Fix: Ensure `storage` has correct typings
const storage: StorageEngine = multer.diskStorage({
  destination: (
    req: Request, 
    file: Express.Multer.File, 
    cb: DestinationCallback
  ): void => {
    const dirPath = path.resolve(DIR_UPLOADS_NAME);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    cb(null, dirPath);
  },

  filename: (
    req: Request, 
    file: Express.Multer.File, 
    cb: FileNameCallback
  ): void => {
    cb(null, `${Date.now()}-${file.fieldname}-${file.originalname}`);
  },
});

// ✅ Fix: Ensure the export uses the correct types
const upload = multer({ storage, fileFilter });
export default upload;