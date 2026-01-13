import { flutterwaveClient } from './client';
import { logger } from '../../utils/logger';
import { FlutterwaveCardResponse } from '../../types';
import { maskCardNumber, getLast4Digits } from '../../utils/cardMasking';

export interface CreateCardPayload {
    currency: string;
    amount: number;
    billing_name: string;
    billing_address?: string;
    billing_city?: string;
    billing_state?: string;
    billing_postal_code?: string;
    billing_country?: string;
}

export interface CardResponse {
    id: string;
    maskedNumber: string;
    last4: string;
    expiry: string;
    cvv?: string; // Only on creation
    balance: number;
    currency: string;
    nameOnCard: string;
    status: 'ACTIVE' | 'FROZEN' | 'CANCELLED';
    type: 'VISA' | 'MASTERCARD';
    createdAt: string;
}

/**
 * Create a new virtual card via Flutterwave
 */
export async function createVirtualCard(
    payload: CreateCardPayload
): Promise<CardResponse> {
    try {
        logger.info('Creating virtual card', { currency: payload.currency, amount: payload.amount });

        const response = await flutterwaveClient.post<{
            status: string;
            message: string;
            data: FlutterwaveCardResponse;
        }>('/virtual-cards', {
            currency: payload.currency,
            amount: payload.amount,
            billing_name: payload.billing_name,
            billing_address: payload.billing_address || '123 Main St',
            billing_city: payload.billing_city || 'Kinshasa',
            billing_state: payload.billing_state || 'Kinshasa',
            billing_postal_code: payload.billing_postal_code || '00000',
            billing_country: payload.billing_country || 'CD',
            callback_url: '', // Optional webhook URL for card events
        });

        if (response.status !== 'success') {
            throw new Error(response.message || 'Failed to create virtual card');
        }

        const card = response.data;

        return {
            id: card.id,
            maskedNumber: card.masked_pan || maskCardNumber(card.card_pan),
            last4: getLast4Digits(card.card_pan),
            expiry: card.expiration,
            cvv: card.cvv, // Include CVV only on creation
            balance: parseFloat(card.amount),
            currency: card.currency,
            nameOnCard: card.name_on_card,
            status: card.is_active ? 'ACTIVE' : 'FROZEN',
            type: card.card_type === 'mastercard' ? 'MASTERCARD' : 'VISA',
            createdAt: card.created_at,
        };
    } catch (error: any) {
        logger.error('Failed to create virtual card', error);
        throw new Error(error.response?.data?.message || 'Failed to create virtual card');
    }
}

/**
 * Get card details by ID
 */
export async function getCardDetails(cardId: string): Promise<CardResponse> {
    try {
        logger.info('Fetching card details', { cardId });

        const response = await flutterwaveClient.get<{
            status: string;
            message: string;
            data: FlutterwaveCardResponse;
        }>(`/virtual-cards/${cardId}`);

        if (response.status !== 'success') {
            throw new Error(response.message || 'Failed to fetch card details');
        }

        const card = response.data;

        return {
            id: card.id,
            maskedNumber: card.masked_pan || maskCardNumber(card.card_pan),
            last4: getLast4Digits(card.card_pan),
            expiry: card.expiration,
            // Never return CVV when fetching existing card
            balance: parseFloat(card.amount),
            currency: card.currency,
            nameOnCard: card.name_on_card,
            status: card.is_active ? 'ACTIVE' : 'FROZEN',
            type: card.card_type === 'mastercard' ? 'MASTERCARD' : 'VISA',
            createdAt: card.created_at,
        };
    } catch (error: any) {
        logger.error('Failed to fetch card details', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch card details');
    }
}

/**
 * Freeze a virtual card
 */
export async function freezeCard(cardId: string): Promise<void> {
    try {
        logger.info('Freezing card', { cardId });

        const response = await flutterwaveClient.put<{
            status: string;
            message: string;
        }>(`/virtual-cards/${cardId}/status/block`);

        if (response.status !== 'success') {
            throw new Error(response.message || 'Failed to freeze card');
        }
    } catch (error: any) {
        logger.error('Failed to freeze card', error);
        throw new Error(error.response?.data?.message || 'Failed to freeze card');
    }
}

/**
 * Unfreeze a virtual card
 */
export async function unfreezeCard(cardId: string): Promise<void> {
    try {
        logger.info('Unfreezing card', { cardId });

        const response = await flutterwaveClient.put<{
            status: string;
            message: string;
        }>(`/virtual-cards/${cardId}/status/unblock`);

        if (response.status !== 'success') {
            throw new Error(response.message || 'Failed to unfreeze card');
        }
    } catch (error: any) {
        logger.error('Failed to unfreeze card', error);
        throw new Error(error.response?.data?.message || 'Failed to unfreeze card');
    }
}

/**
 * Fund a virtual card
 */
export async function fundCard(cardId: string, amount: number): Promise<void> {
    try {
        logger.info('Funding card', { cardId, amount });

        const response = await flutterwaveClient.post<{
            status: string;
            message: string;
        }>(`/virtual-cards/${cardId}/fund`, {
            amount,
            debit_currency: 'USD',
        });

        if (response.status !== 'success') {
            throw new Error(response.message || 'Failed to fund card');
        }
    } catch (error: any) {
        logger.error('Failed to fund card', error);
        throw new Error(error.response?.data?.message || 'Failed to fund card');
    }
}
