import { createClient, type User } from '@supabase/supabase-js';
import { logger } from '../config/logger.js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  logger.warn(
    'Supabase credentials not configured. Database operations will fail.',
  );
}

const supabase = createClient(SUPABASE_URL || '', SUPABASE_SERVICE_ROLE_KEY || '', {
  auth: {
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

export { supabase, type User };
export default supabase;