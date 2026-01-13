import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// All user routes require authentication
router.use(requireAuth);

// GET routes
router.get('/cards', UserController.getCards);
router.get('/transactions', UserController.getTransactions);

// POST/PUT routes
router.put('/profile', UserController.updateProfile);
router.post('/transactions', UserController.createTransaction);
router.put('/cards/balance', UserController.updateCardBalance);

export default router;
