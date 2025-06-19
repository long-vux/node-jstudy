import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request interface to include user property
declare global {
    namespace Express {
        interface User {
            id: string;
            role: string;
        }
        interface Request {
            user?: User;
        }
    }
}

const jwtSecret = process.env.JWT_SECRET || 'secret-key';

export const checkUser = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        res.status(403).json({ message: 'No token provided.' });
        return;
    }

    jwt.verify(token, jwtSecret, (err: jwt.JsonWebTokenError | null, decoded: any) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to authenticate token.' });
        }

        if (!decoded || typeof decoded.id !== 'string' || typeof decoded.role !== 'string') {
            return res.status(400).json({ message: 'Invalid token payload.' });
        }

        req.user = { id: decoded.id, role: decoded.role };
        
        next();
    });
};

export const checkAdmin = (req: Request, res: Response, next: NextFunction): void => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admin role required.' });
    }
};
