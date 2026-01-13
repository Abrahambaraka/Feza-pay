import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { verifyWebhookSignature, processWebhookEvent, WebhookEvent } from '../services/flutterwave/webhooks';

/**
 * Handle Flutterwave webhook events
 */
export async function handleWebhook(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const signature = req.headers['verif-hash'] as string;
        const payload = JSON.stringify(req.body);

        logger.info('Received webhook', { event: req.body.event });

        // Verify webhook signature
        if (!verifyWebhookSignature(signature, payload)) {
            logger.warn('Invalid webhook signature');
            res.status(401).json({
                success: false,
                error: { message: 'Invalid signature', code: 'INVALID_SIGNATURE' },
            });
            return;
        }

        const event: WebhookEvent = req.body;

        // Process event asynchronously
        processWebhookEvent(event).catch((error) => {
            logger.error('Error processing webhook event', error);
        });

        // TODO: Update transaction status in your database based on event
        if (event.event === 'charge.completed') {
            const txRef = event.data.tx_ref;

            // TODO: Find transaction by reference in your database and update status
            logger.info('Webhook received - should update transaction in database', {
                reference: txRef,
                status: event.data.status,
            });
        }

        // Respond quickly to Flutterwave
        res.status(200).json({ success: true });
    } catch (error) {
        logger.error('Webhook handler error', error);
        next(error);
    }
}
