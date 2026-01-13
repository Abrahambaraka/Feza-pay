import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config';
import { logger } from './utils/logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { generalLimiter } from './middleware/rateLimiter';

// Import routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import kycRoutes from './routes/kyc.routes';
import issuingRoutes from './routes/issuing.routes';
import payinRoutes from './routes/payin.routes';
import webhooksRoutes from './routes/webhooks.routes';
import { DatabaseService } from './services/database.service';

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

// API routes
const apiRouter = express.Router();

apiRouter.get('/health', (_req: Request, res: Response) => {
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

apiRouter.use('/auth', authRoutes);
apiRouter.use('/user', userRoutes);
apiRouter.use('/kyc', kycRoutes);
apiRouter.use('/issuing', issuingRoutes);
apiRouter.use('/payin', payinRoutes);
apiRouter.use('/webhooks', webhooksRoutes);

// Mount the router under /api
app.use('/api', apiRouter);

// Fallback for root routes (for local development or direct access)
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/kyc', kycRoutes);
app.use('/issuing', issuingRoutes);
app.use('/payin', payinRoutes);
app.use('/webhooks', webhooksRoutes);

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
