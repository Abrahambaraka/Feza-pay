import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// Google OAuth routes
router.get('/google', AuthController.initiateGoogleAuth);
router.get('/google/callback', AuthController.handleGoogleCallback);

// Email/Password routes
router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);

// Protected routes
router.get('/me', requireAuth, AuthController.getCurrentUser);
router.post('/logout', requireAuth, AuthController.logout);

export default router;
