import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { config } from '../config';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
        public code?: string,
        public details?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

/**
 * Global error handling middleware
 */
export function errorHandler(
    err: Error | ApiError,
    req: Request,
    res: Response,
    _next: NextFunction
): void {
    // Log the error
    logger.error('Error occurred', {
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
    });

    // Handle ApiError
    if (err instanceof ApiError) {
        res.status(err.statusCode).json({
            success: false,
            error: {
                message: err.message,
                code: err.code || 'API_ERROR',
                details: err.details,
            },
        });
        return;
    }

    // Handle validation errors (Zod)
    if (err.name === 'ZodError') {
        res.status(400).json({
            success: false,
            error: {
                message: 'Validation error',
                code: 'VALIDATION_ERROR',
                details: err,
            },
        });
        return;
    }

    // Handle generic errors
    const isDevelopment = config.nodeEnv === 'development';

    res.status(500).json({
        success: false,
        error: {
            message: isDevelopment ? err.message : 'Internal server error',
            code: 'INTERNAL_SERVER_ERROR',
            ...(isDevelopment && { stack: err.stack }),
        },
    });
}

/**
 * 404 Not Found handler
 */
export function notFoundHandler(req: Request, res: Response): void {
    res.status(404).json({
        success: false,
        error: {
            message: `Route ${req.method} ${req.path} not found`,
            code: 'NOT_FOUND',
        },
    });
}
