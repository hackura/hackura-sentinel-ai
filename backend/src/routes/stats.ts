import { Router, Request, Response } from 'express';
import { getDashboardStats, getScansByUser } from '../services/supabase.js';
import { AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /dashboard/stats — Aggregated stats
router.get('/stats', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const stats = await getDashboardStats(userId);
    return res.json({ success: true, data: stats });
  } catch (error: any) {
    console.error('Stats error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch stats' });
  }
});

export default router;
