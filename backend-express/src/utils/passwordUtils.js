import { createHash } from 'crypto';
import 'dotenv/config';

export const hashPassword = (password) => {
  return createHash('sha256').update(password).digest('hex').toLowerCase();
};
