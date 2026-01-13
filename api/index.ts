import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

// Import the apiRouter directly to avoid nested app issues
// Note: We use .js extension for ESM compatibility on Vercel
app.all('/api/(.*)', async (req, res, next) => {
    try {
        const { default: mainApp } = await import('../backend/src/index.js');
        // Instead of calling mainApp(req, res), we can just use its router if possible,
        // but calling mainApp(req, res) should work if we ensure the path is correct.
        // Let's try to just forward it but catch errors.
        return (mainApp as any)(req, res);
    } catch (error: any) {
        console.error('[Vercel API Error]', error);
        res.status(500).json({
            success: false,
            error: { message: 'Initialization error', details: error.message }
        });
    }
});

export default app;
