import { Router } from 'express';
import { authenticateUser } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { strictLimiter } from '../middleware/rateLimiter';
import { kycVerifySchema } from '../schemas/kyc.schema';
import { verifyKyc, getKycStatus } from '../controllers/kyc.controller';

const router = Router();

/**
 * POST /kyc/verify
 * Submit KYC documents for verification
 */
router.post(
    '/verify',
    authenticateUser,
    strictLimiter,
    validate(kycVerifySchema),
    verifyKyc
);

/**
 * GET /kyc/status
 * Get KYC verification status
 */
router.get(
    '/status',
    authenticateUser,
    getKycStatus
);

export default router;
