import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { logger } from '../utils/logger';

/**
 * Middleware factory for Zod schema validation
 * @param schema - Zod schema to validate against
 * @param target - Which part of request to validate ('body' | 'query' | 'params')
 */
export function validate(
    schema: ZodSchema,
    target: 'body' | 'query' | 'params' = 'body'
) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = req[target];
            const validated = await schema.parseAsync(data);

            // Replace request data with validated data
            req[target] = validated;

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errors = error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));

                logger.warn('Validation error', { errors, target });

                res.status(400).json({
                    success: false,
                    error: {
                        message: 'Validation failed',
                        code: 'VALIDATION_ERROR',
                        details: errors,
                    },
                });
                return;
            }

            logger.error('Unexpected validation error', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Internal validation error',
                    code: 'VALIDATION_INTERNAL_ERROR',
                },
            });
        }
    };
}
