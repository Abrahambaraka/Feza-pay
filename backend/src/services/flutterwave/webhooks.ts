import crypto from 'crypto';
import { config } from '../../config';
import { logger } from '../../utils/logger';

export interface WebhookEvent {
    event: string;
    data: {
        id: number;
        tx_ref: string;
        flw_ref: string;
        amount: number;
        currency: string;
        charged_amount: number;
        status: string;
        payment_type: string;
        created_at: string;
        customer: {
            id: number;
            email: string;
            phone_number: string;
            name: string;
        };
        card?: {
            first_6digits: string;
            last_4digits: string;
            issuer: string;
            country: string;
            type: string;
            expiry: string;
        };
    };
}

/**
 * Verify Flutterwave webhook signature
 * @param signature - Signature from request header
 * @param payload - Raw request body
 * @returns true if signature is valid
 */
export function verifyWebhookSignature(signature: string, payload: string): boolean {
    try {
        const hash = config.flutterwave.webhookHash;

        if (!hash) {
            logger.warn('Webhook hash not configured, skipping verification');
            return true; // Allow in development if hash not set
        }

        const expectedSignature = crypto
            .createHmac('sha256', hash)
            .update(payload)
            .digest('hex');

        const isValid = signature === expectedSignature;

        if (!isValid) {
            logger.warn('Invalid webhook signature', {
                received: signature,
                expected: expectedSignature,
            });
        }

        return isValid;
    } catch (error) {
        logger.error('Error verifying webhook signature', error);
        return false;
    }
}

/**
 * Process webhook event
 * @param event - Webhook event data
 */
export async function processWebhookEvent(event: WebhookEvent): Promise<void> {
    try {
        logger.info('Processing webhook event', {
            event: event.event,
            txRef: event.data.tx_ref,
            status: event.data.status,
        });

        switch (event.event) {
            case 'charge.completed':
                await handleChargeCompleted(event.data);
                break;

            case 'transfer.completed':
                await handleTransferCompleted(event.data);
                break;

            default:
                logger.info('Unhandled webhook event type', { event: event.event });
        }
    } catch (error) {
        logger.error('Error processing webhook event', error);
        throw error;
    }
}

/**
 * Handle charge completed event
 */
async function handleChargeCompleted(data: WebhookEvent['data']): Promise<void> {
    logger.info('Charge completed', {
        txRef: data.tx_ref,
        amount: data.amount,
        status: data.status,
    });

    // TODO: Update transaction status in Firestore
    // This will be implemented in the controllers
}

/**
 * Handle transfer completed event
 */
async function handleTransferCompleted(data: WebhookEvent['data']): Promise<void> {
    logger.info('Transfer completed', {
        txRef: data.tx_ref,
        amount: data.amount,
        status: data.status,
    });

    // TODO: Update transaction status in Firestore
}
