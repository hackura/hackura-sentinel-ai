import { Router, Response } from 'express';
import { getDashboardStats } from '../services/supabase.js';
import { authMiddleware, type AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /dashboard/stats — Aggregated stats
router.get('/stats', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const stats = await getDashboardStats(userId);
    return res.json({ success: true, data: stats });
  } catch (error: any) {
    console.error('Stats error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch stats' });
  }
});

export default router;
