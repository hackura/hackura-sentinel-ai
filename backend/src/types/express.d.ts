import type { User } from '../services/supabase.js';

declare module 'express' {
  interface Request {
    user?: User;
  }
}
