import { Router, Request, Response } from 'express';
import { analyzeThreat } from '../services/ollama.js';
import { createScan, getScanById } from '../services/supabase.js';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth.js';

const router = Router();

// Request validation schema
const scanSchema = z.object({
  input: z.string().min(1),
  type: z.enum(['url', 'domain', 'text']),
});

export interface ScanRequestBody {
  input: string;
  type: 'url' | 'domain' | 'text';
}

// POST /scan — Perform threat analysis
router.post('/', async (req: Request<{}, {}, ScanRequestBody>, res: Response) => {
  try {
    // Validate input
    const parsed = scanSchema.parse(req.body);
    const { input, type } = parsed;

    // Call Ollama AI
    const analysis = await analyzeThreat(input, type);

    // Store in Supabase (user_id is added by auth middleware)
    // Note: in production, req.user is set by authMiddleware
    const scanRecord = await createScan({
      user_id: req.user?.id || 'anonymous',
      input,
      type,
      risk_score: analysis.risk_score,
      risk_level: analysis.risk_level,
      confidence_score: analysis.confidence_score,
      ai_explanation: analysis.ai_explanation,
      risk_signals: analysis.risk_signals,
    });

    return res.json({ success: true, data: scanRecord });
  } catch (error: any) {
    console.error('Scan error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Invalid input', details: error.errors });
    }
    return res.status(500).json({ success: false, error: error.message || 'Scan failed' });
  }
});

// GET /scans/:id — Get single scan
router.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const scan = await getScanById(id, userId);
    return res.json({ success: true, data: scan });
  } catch (error: any) {
    console.error('Get scan error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch scan' });
  }
});

export default router;
