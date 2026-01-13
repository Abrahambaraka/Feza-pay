import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { initiateMobileMoneyCharge, verifyTransaction as verifyFlwTransaction } from '../services/flutterwave/charges';
import { MobileMoneyChargeInput } from '../schemas/payin.schema';
import { ApiError } from '../middleware/errorHandler';

/**
 * Initiate mobile money payment
 */
export async function initiatePayment(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const userId = req.user?.uid;
        const userEmail = req.user?.email;

        if (!userId || !userEmail) {
            throw new ApiError(401, 'Unauthorized', 'UNAUTHORIZED');
        }

        const payload = req.body as MobileMoneyChargeInput;

        logger.info('Initiating mobile money payment', {
            userId,
            amount: payload.amount,
            network: payload.network,
        });

        // Initiate charge via Flutterwave
        const charge = await initiateMobileMoneyCharge({
            ...payload,
            email: payload.email || userEmail,
        } as any); // Explicit cast to bypass inference issue

        // TODO: Store pending transaction in your database
        const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        const txData = {
            id: transactionId,
            type: 'DEPOSIT',
            amount: payload.amount,
            currency: payload.currency,
            merchant: `Depot ${payload.network} M-Pesa`,
            status: charge.status,
            reference: charge.reference,
            flutterwaveId: charge.transactionId,
            metadata: {
                network: payload.network,
                phoneNumber: payload.phone_number,
            },
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        logger.info('Mobile money payment initiated (should be stored in database)', {
            userId,
            transactionId,
            flutterwaveId: charge.transactionId,
            txData,
        });

        res.status(201).json({
            success: true,
            data: {
                transactionId,
                reference: charge.reference,
                status: charge.status,
                amount: charge.amount,
                currency: charge.currency,
                message: charge.message,
            },
        });
    } catch (error) {
        logger.error('Error initiating mobile money payment', error);
        next(error);
    }
}

/**
 * Verify transaction status
 */
export async function verifyTransaction(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const userId = req.user?.uid;
        if (!userId) {
            throw new ApiError(401, 'Unauthorized', 'UNAUTHORIZED');
        }

        const { transactionId } = req.params;

        logger.info('Verifying transaction', { userId, transactionId });

        // TODO: Get transaction from your database
        // For now, verify directly with Flutterwave using transactionId as reference
        logger.info('Fetching transaction from database (TODO: implement)', { userId, transactionId });

        // Verify with Flutterwave (assuming transactionId is the Flutterwave reference)
        const verification = await verifyFlwTransaction(transactionId);

        // TODO: Update transaction status in your database
        logger.info('Transaction verified (should update database)', {
            userId,
            transactionId,
            status: verification.status,
        });

        logger.info('Transaction verified', {
            userId,
            transactionId,
            status: verification.status,
        });

        res.json({
            success: true,
            data: {
                transactionId,
                reference: verification.reference,
                status: verification.status,
                amount: verification.amount,
                currency: verification.currency,
            },
        });
    } catch (error) {
        logger.error('Error verifying transaction', error);
        next(error);
    }
}
