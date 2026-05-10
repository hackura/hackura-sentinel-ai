import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Routes
import scanRouter from './routes/scan.js';
import scansRouter from './routes/scans.js';
import graphRouter from './routes/graph.js';
import statsRouter from './routes/stats.js';

// Load env
dotenv.load({ override: true } as any);

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS || 'https://sentinel.hackura.app',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { success: false, error: 'Too many requests' },
});
app.use('/api/', limiter);

// Body parser
app.use(express.json());

// Health check (public, no auth)
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes — scan routes include auth middleware
app.use('/scan', scanRouter); // POST /scan, GET /scan/:id
app.use('/scans', scansRouter); // GET /scans
app.use('/graph', graphRouter); // GET /graph/:entity
app.use('/dashboard', statsRouter); // GET /dashboard/stats

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Hackura Sentinel API running on port ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   CORS: ${process.env.ALLOWED_ORIGINS || 'https://sentinel.hackura.app'}`);
});

export default app;
