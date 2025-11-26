import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('SUPABASE_JWT_SECRET is required.');
}

export interface AuthenticatedRequest extends Request {
  user?: any;
  headers: any;
  params: any;
  body: any;
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = (req.headers as any).authorization?.split(' ')[1];

  if (!token) {
    return (res as any).status(401).json({ message: 'Authentication token is missing.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    (next as any)();
  } catch (error) {
    return (res as any).status(401).json({ message: 'Invalid authentication token.' });
  }
};
