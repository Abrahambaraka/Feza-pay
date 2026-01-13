import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

// Wrapper for error handling
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/api/health', async (req, res) => {
    try {
        // Attempt to import dependencies inside the handler to catch errors
        const { config } = await import('../backend/src/config');
        const { DatabaseService } = await import('../backend/src/services/database.service');

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
            stack: error.stack,
            env_keys: Object.keys(process.env).filter(k => k.includes('URL') || k.includes('KEY') || k.includes('SECRET'))
        });
    }
});

// For other routes, we still try the main app but with protection
app.use('/api/(.*)', async (req, res) => {
    try {
        const { default: mainApp } = await import('../backend/src/index');
        return (mainApp as any)(req, res);
    } catch (error: any) {
        res.status(500).json({ error: 'Main app failed to load', message: error.message });
    }
});

export default app;
