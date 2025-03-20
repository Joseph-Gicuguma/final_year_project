import { execSync } from 'child_process';
const port = process.env.PORT || 10000;

try {
  execSync(`vite preview --host --port ${port}`, { stdio: 'inherit' });
} catch (error) {
  console.error('Error starting the server:', error);
  process.exit(1);
} 