import { Router } from 'express';
import { authenticateUser } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { paymentLimiter } from '../middleware/rateLimiter';
import { mobileMoneyChargeSchema } from '../schemas/payin.schema';
import { initiatePayment, verifyTransaction } from '../controllers/payin.controller';

const router = Router();

/**
 * POST /payin/mobile-money
 * Initiate mobile money payment
 */
router.post(
    '/mobile-money',
    authenticateUser,
    paymentLimiter,
    validate(mobileMoneyChargeSchema),
    initiatePayment
);

/**
 * GET /payin/verify/:transactionId
 * Verify transaction status
 */
router.get(
    '/verify/:transactionId',
    authenticateUser,
    verifyTransaction
);

export default router;
