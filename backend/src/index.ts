import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Routes
import scanRouter from './routes/scan.js';
import scansRouter from './routes/scans.js';
import graphRouter from './routes/graph.js';
import statsRouter from './routes/stats.js';

// Load env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS || 'https://sentinel.hackura.app',
  credentials: true,
}));

// Body parser
app.use(express.json());

// Health check (public, no auth)
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes — auth middleware applied per-route
app.use('/scan', scanRouter);
app.use('/scans', scansRouter);
app.use('/graph', graphRouter);
app.use('/dashboard', statsRouter);

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
