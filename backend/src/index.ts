import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/index.js';
import { logger } from './utils/logger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { generalLimiter } from './middleware/rateLimiter.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import kycRoutes from './routes/kyc.routes.js';
import issuingRoutes from './routes/issuing.routes.js';
import payinRoutes from './routes/payin.routes.js';
import webhooksRoutes from './routes/webhooks.routes.js';
import { DatabaseService } from './services/database.service.js';

// Initialize database
DatabaseService.initializeTables().catch(err => {
    logger.error('Failed to initialize database tables:', err);
});


const app: Application = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
    origin: config.cors.allowedOrigins,
    credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (config.nodeEnv === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Rate limiting (apply to all routes except webhooks)
// Note: On Vercel, routes don't have /api prefix, so we apply to all routes
app.use(generalLimiter);

// Health check
app.get(['/api/health', '/health'], (_req: Request, res: Response) => {
    const missingKeys = [];
    if (!config.flutterwave.publicKey) missingKeys.push('FLW_PUBLIC_KEY');
    if (!config.flutterwave.secretKey) missingKeys.push('FLW_SECRET_KEY');
    if (!config.flutterwave.encryptionKey) missingKeys.push('FLW_ENCRYPTION_KEY');

    res.json({
        success: true,
        data: {
            status: missingKeys.length > 0 ? 'partially_configured' : 'healthy',
            timestamp: new Date().toISOString(),
            environment: config.nodeEnv,
            vercel: !!process.env.VERCEL,
            missing_config: missingKeys,
        },
    });
});

// Mount routes at both /api and root to be safe on Vercel
const routers = [
    { path: '/auth', router: authRoutes },
    { path: '/user', router: userRoutes },
    { path: '/kyc', router: kycRoutes },
    { path: '/issuing', router: issuingRoutes },
    { path: '/payin', router: payinRoutes },
    { path: '/webhooks', router: webhooksRoutes }
];

routers.forEach(({ path, router: r }) => {
    app.use(`/api${path}`, r);
    app.use(path, r);
});

app.get('/health', (_req: Request, res: Response) => {
    res.redirect('/api/health');
});

// 404 handler
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = config.port;

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => {
        logger.info(`🚀 Server running on port ${PORT}`);
        logger.info(`📝 Environment: ${config.nodeEnv}`);
        logger.info(`🔒 CORS allowed origins: ${config.cors.allowedOrigins.join(', ')}`);
    });
}

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('SIGINT signal received: closing HTTP server');
    process.exit(0);
});

export default app;
