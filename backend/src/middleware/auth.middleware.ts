import { Request, Response, NextFunction } from 'express';
import { extractTokenFromHeader, verifyToken } from '../utils/jwt.utils';
import { DatabaseService } from '../services/database.service';

export interface AuthRequest extends Request {
    authUser?: {
        userId: string;
        email: string;
        displayName: string;
    };
}


export const requireAuth = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = extractTokenFromHeader(req.headers.authorization);

        if (!token) {
            res.status(401).json({
                success: false,
                error: 'Authentication required. Please provide a valid token.',
            });
            return;
        }

        const payload = verifyToken(token);

        // Verify user still exists
        const user = await DatabaseService.findUserById(payload.userId);
        if (!user) {
            res.status(401).json({
                success: false,
                error: 'User not found. Please login again.',
            });
            return;
        }

        // Attach user info to request
        req.authUser = {
            userId: payload.userId,
            email: payload.email,
            displayName: payload.displayName,
        };

        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            error: 'Invalid or expired token. Please login again.',
        });
    }
};
