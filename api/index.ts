import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

// Wrapper for error handling
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

// Diagnostic logging
app.use((req, _res, next) => {
    console.log(`[API Proxy] ${req.method} ${req.url}`);
    next();
});

app.get('/api/health', async (req, res) => {
    try {
        // Attempt to import dependencies with .js extensions for ESM runtime compatibility
        const { config } = await import('../backend/src/config/index.js');
        const { DatabaseService } = await import('../backend/src/services/database.service.js');

        res.json({
            status: 'ok',
            vercel: true,
            database_ready: !!DatabaseService,
            env: {
                node_env: process.env.NODE_ENV,
                has_db_url: !!process.env.POSTGRES_URL,
                has_flw_key: !!process.env.FLW_SECRET_KEY
            }
        });
    } catch (error: any) {
        res.status(500).json({
            error: 'Backend initialization failed',
            message: error.message,
            stack: error.stack
        });
    }
});

// For other routes, we still try the main app but with protection
app.all('/api/(.*)', async (req, res) => {
    try {
        const { default: mainApp } = await import('../backend/src/index.js');
        // Ensure the path is correct for the mainApp
        // If req.url is /api/auth/signup, mainApp expects that because it has app.use('/api', ...)
        return (mainApp as any)(req, res);
    } catch (error: any) {
        console.error('[API Proxy Error]', error);
        res.status(500).json({ error: 'Main app failed to load', message: error.message });
    }
});

export default app;
