import { Router } from 'express';
import { authenticateUser } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { strictLimiter } from '../middleware/rateLimiter';
import { createCardSchema } from '../schemas/issuing.schema';
import { createCard, getCardDetails, freezeCard, unfreezeCard } from '../controllers/issuing.controller';

const router = Router();

/**
 * POST /issuing/cards
 * Create a new virtual card
 */
router.post(
    '/cards',
    authenticateUser,
    strictLimiter,
    validate(createCardSchema),
    createCard
);

/**
 * GET /issuing/cards/:cardId
 * Get card details
 */
router.get(
    '/cards/:cardId',
    authenticateUser,
    getCardDetails
);

/**
 * POST /issuing/cards/:cardId/freeze
 * Freeze a card
 */
router.post(
    '/cards/:cardId/freeze',
    authenticateUser,
    freezeCard
);

/**
 * POST /issuing/cards/:cardId/unfreeze
 * Unfreeze a card
 */
router.post(
    '/cards/:cardId/unfreeze',
    authenticateUser,
    unfreezeCard
);

export default router;
