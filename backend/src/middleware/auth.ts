import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * Middleware to verify authentication token
 * Simplified version - accepts any Bearer token and extracts user ID from it
 * In production, implement proper JWT verification or OAuth
 */
export async function authenticateUser(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                error: {
                    message: 'Missing or invalid authorization header',
                    code: 'UNAUTHORIZED',
                },
            });
            return;
        }

        const token = authHeader.split('Bearer ')[1];

        // Simplified: Extract user ID from token (assuming token format: user_xxx or similar)
        // In production, implement proper JWT verification
        const userId = token.startsWith('user_') ? token : `user_${token.substring(0, 8)}`;

        // Attach user info to request
        req.user = {
            uid: userId,
            email: undefined,
            name: undefined,
        };

        logger.debug('User authenticated', { uid: req.user.uid });
        next();
    } catch (error) {
        logger.error('Authentication error', error);
        res.status(500).json({
            success: false,
            error: {
                message: 'Internal server error during authentication',
                code: 'AUTH_ERROR',
            },
        });
    }
}

/**
 * Optional authentication middleware
 * Attaches user if token is present, but doesn't require it
 */
export async function optionalAuth(
    req: Request,
    _res: Response,
    next: NextFunction
): Promise<void> {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split('Bearer ')[1];
        const userId = token.startsWith('user_') ? token : `user_${token.substring(0, 8)}`;
        
        req.user = {
            uid: userId,
            email: undefined,
            name: undefined,
        };
    }

    next();
}
