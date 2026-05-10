import { Router, Request, Response } from 'express';
import { generateThreatGraph } from '../services/ollama.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// GET /graph/:entity — Get threat graph
router.get('/:entity', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { entity } = req.params;

    if (!entity || entity.length < 1) {
      return res.status(400).json({ success: false, error: 'Entity parameter required' });
    }

    const graphData = await generateThreatGraph(entity as string);
    return res.json({ success: true, data: graphData });
  } catch (error: any) {
    console.error('Graph error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to generate graph' });
  }
});

export default router;
