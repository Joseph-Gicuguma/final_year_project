import dotenv from 'dotenv';
import initializeApp from './server/index.js';
import validateEnv from './validation/env.js';

dotenv.config();
validateEnv();

initializeApp();
