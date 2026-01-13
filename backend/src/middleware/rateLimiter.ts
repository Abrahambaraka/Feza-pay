import rateLimit from 'express-rate-limit';
import { config } from '../config';

/**
 * General rate limiter for all endpoints
 */
export const generalLimiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.maxRequests,
    message: {
        success: false,
        error: {
            message: 'Too many requests, please try again later',
            code: 'RATE_LIMIT_EXCEEDED',
        },
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Strict rate limiter for sensitive operations (KYC, card creation)
 */
export const strictLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per 15 minutes
    message: {
        success: false,
        error: {
            message: 'Too many attempts, please try again later',
            code: 'RATE_LIMIT_EXCEEDED',
        },
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Payment rate limiter
 */
export const paymentLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 3, // 3 payments per minute
    message: {
        success: false,
        error: {
            message: 'Too many payment requests, please wait before trying again',
            code: 'PAYMENT_RATE_LIMIT_EXCEEDED',
        },
    },
    standardHeaders: true,
    legacyHeaders: false,
});
