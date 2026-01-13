import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { DatabaseService } from '../backend/src/services/database.service';
import authRoutes from '../backend/src/routes/auth.routes';
import userRoutes from '../backend/src/routes/user.routes';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

// Initialize database
DatabaseService.initializeTables().catch(err => {
    console.error('Failed to initialize database tables:', err);
});

app.get('/api/health', async (req, res) => {
    res.json({ status: 'ok', vercel: true });
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Handle other routes
app.use('/api/(.*)', (req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

export default app;
