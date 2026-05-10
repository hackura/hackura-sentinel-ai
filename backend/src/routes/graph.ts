import { Router, Request, Response } from 'express';
import { generateThreatGraph } from '../services/ollama.js';
import { AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /graph/:entity — Get threat graph
router.get('/:entity', async (req: AuthRequest<{ entity: string }>, res: Response) => {
  try {
    const { entity } = req.params;

    if (!entity || entity.length < 1) {
      return res.status(400).json({ success: false, error: 'Entity parameter required' });
    }

    // Generate graph via Ollama (future: query Neo4j first, fallback to AI)
    const graphData = await generateThreatGraph(entity);

    return res.json({ success: true, data: graphData });
  } catch (error: any) {
    console.error('Graph error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to generate graph' });
  }
});

export default router;
