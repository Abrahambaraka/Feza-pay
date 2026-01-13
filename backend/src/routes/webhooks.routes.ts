import { Router } from 'express';
import { handleWebhook } from '../controllers/webhooks.controller';

const router = Router();

/**
 * POST /webhooks/flutterwave
 * Handle Flutterwave webhook events
 * Note: No authentication middleware - uses signature verification instead
 */
router.post('/flutterwave', handleWebhook);

export default router;
