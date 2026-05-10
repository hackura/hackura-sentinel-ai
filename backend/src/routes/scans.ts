import { Router, Request, Response } from 'express';
import { getScansByUser } from '../services/supabase.js';
import { AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /scans — List user's scans
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const scans = await getScansByUser(userId, limit);

    return res.json({ success: true, data: scans });
  } catch (error: any) {
    console.error('List scans error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch scans' });
  }
});

export default router;
