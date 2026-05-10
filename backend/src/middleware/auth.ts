import { Request, Response, NextFunction } from 'express';
import { verifyToken, User } from '../services/supabase.js';

export interface AuthRequest extends Request {
  user?: User;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  const token = authHeader.slice(7);

  // Verify token with Supabase
  verifyToken(token)
    .then(user => {
      if (!user) {
        return res.status(401).json({ success: false, error: 'Invalid token' });
      }
      req.user = user;
      next();
    })
    .catch(err => {
      console.error('Auth error:', err);
      res.status(401).json({ success: false, error: 'Authentication failed' });
    });
}
