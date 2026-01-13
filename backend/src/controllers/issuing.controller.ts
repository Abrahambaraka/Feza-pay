import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { createVirtualCard, getCardDetails as getFlwCardDetails, freezeCard as freezeFlwCard, unfreezeCard as unfreezeFlwCard } from '../services/flutterwave/issuing';
import { CreateCardInput } from '../schemas/issuing.schema';
import { ApiError } from '../middleware/errorHandler';

/**
 * Create virtual card
 * Requires: Verified KYC + Confirmed payment transaction
 */
export async function createCard(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const userId = req.user?.uid;
        if (!userId) {
            throw new ApiError(401, 'Unauthorized', 'UNAUTHORIZED');
        }

        const payload = req.body as CreateCardInput;

        logger.info('Creating virtual card', { userId, currency: payload.currency });

        // 1. Verify KYC status (TODO: Replace with your database query)
        // For now, skip KYC check - implement your own verification
        logger.info('KYC check skipped - implement your own verification', { userId });

        // 2. If transactionId provided, verify payment was successful (TODO: Replace with your database query)
        if (payload.transactionId) {
            // TODO: Verify transaction from your database
            logger.info('Transaction verification skipped - implement your own verification', { 
                userId, 
                transactionId: payload.transactionId 
            });
        }

        // 3. Create card via Flutterwave
        const card = await createVirtualCard({
            currency: payload.currency,
            amount: payload.amount || 0,
            billing_name: payload.billingName,
            billing_address: payload.billingAddress,
            billing_city: payload.billingCity,
            billing_state: payload.billingState,
            billing_postal_code: payload.billingPostalCode,
            billing_country: payload.billingCountry,
        });

        // 4. Store card metadata (TODO: Replace with your database)
        const cardData = {
            id: card.id,
            maskedNumber: card.maskedNumber,
            last4: card.last4,
            expiry: card.expiry,
            balance: card.balance,
            currency: card.currency,
            label: payload.label || card.nameOnCard,
            status: card.status,
            type: card.type,
            createdAt: card.createdAt,
        };

        // TODO: Store card in your database
        logger.info('Card created (should be stored in database)', { userId, cardData });

        // 5. Log card activation transaction (TODO: Replace with your database)
        const txData = {
            type: 'DEPOSIT',
            amount: 0,
            currency: payload.currency,
            merchant: 'Activation de carte virtuelle',
            status: 'completed',
            createdAt: new Date(),
        };
        logger.info('Card activation transaction (should be stored in database)', { userId, txData });

        logger.info('Virtual card created successfully', { userId, cardId: card.id });

        // Return card with CVV (only on creation)
        res.status(201).json({
            success: true,
            data: {
                ...cardData,
                cvv: card.cvv, // Include CVV only in creation response
            },
        });
    } catch (error) {
        logger.error('Error creating virtual card', error);
        next(error);
    }
}

/**
 * Get card details
 */
export async function getCardDetails(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const userId = req.user?.uid;
        if (!userId) {
            throw new ApiError(401, 'Unauthorized', 'UNAUTHORIZED');
        }

        const { cardId } = req.params;

        logger.info('Fetching card details', { userId, cardId });

        // TODO: Verify card belongs to user in your database
        logger.info('Verifying card ownership (TODO: implement database check)', { userId, cardId });

        // Get latest details from Flutterwave
        const card = await getFlwCardDetails(cardId);

        // TODO: Update card balance/status in your database
        logger.info('Card details fetched (should update database)', {
            userId,
            cardId,
            balance: card.balance,
            status: card.status,
        });

        res.json({
            success: true,
            data: {
                id: card.id,
                maskedNumber: card.maskedNumber,
                last4: card.last4,
                expiry: card.expiry,
                // Never return CVV when fetching existing card
                balance: card.balance,
                currency: card.currency,
                label: card.nameOnCard,
                status: card.status,
                type: card.type,
                createdAt: card.createdAt,
            },
        });
    } catch (error) {
        logger.error('Error fetching card details', error);
        next(error);
    }
}

/**
 * Freeze card
 */
export async function freezeCard(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const userId = req.user?.uid;
        if (!userId) {
            throw new ApiError(401, 'Unauthorized', 'UNAUTHORIZED');
        }

        const { cardId } = req.params;

        logger.info('Freezing card', { userId, cardId });

        // TODO: Verify card belongs to user in your database
        logger.info('Verifying card ownership (TODO: implement database check)', { userId, cardId });

        // Freeze card via Flutterwave
        await freezeFlwCard(cardId);

        // TODO: Update status in your database
        logger.info('Card frozen (should update database)', { userId, cardId, status: 'FROZEN' });

        logger.info('Card frozen successfully', { userId, cardId });

        res.json({
            success: true,
            data: { message: 'Card frozen successfully' },
        });
    } catch (error) {
        logger.error('Error freezing card', error);
        next(error);
    }
}

/**
 * Unfreeze card
 */
export async function unfreezeCard(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const userId = req.user?.uid;
        if (!userId) {
            throw new ApiError(401, 'Unauthorized', 'UNAUTHORIZED');
        }

        const { cardId } = req.params;

        logger.info('Unfreezing card', { userId, cardId });

        // TODO: Verify card belongs to user in your database
        logger.info('Verifying card ownership (TODO: implement database check)', { userId, cardId });

        // Unfreeze card via Flutterwave
        await unfreezeFlwCard(cardId);

        // TODO: Update status in your database
        logger.info('Card unfrozen (should update database)', { userId, cardId, status: 'ACTIVE' });

        logger.info('Card unfrozen successfully', { userId, cardId });

        res.json({
            success: true,
            data: { message: 'Card unfrozen successfully' },
        });
    } catch (error) {
        logger.error('Error unfreezing card', error);
        next(error);
    }
}
