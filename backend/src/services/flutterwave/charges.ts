import { flutterwaveClient } from './client';
import { logger } from '../../utils/logger';
import { FlutterwaveChargeResponse } from '../../types';
import { formatPhoneNumber, validateOperator, type MobileOperator } from '../../utils/phoneValidator';

export interface MobileMoneyChargePayload {
    amount: number;
    currency: string;
    phone_number: string;
    network: MobileOperator;
    email: string;
    fullname?: string;
}

export interface ChargeResponse {
    transactionId: string;
    reference: string;
    status: 'pending' | 'successful' | 'failed';
    amount: number;
    currency: string;
    message?: string;
}

/**
 * Initiate mobile money charge via Flutterwave
 * Supports: Vodacom M-Pesa, Airtel Money, Orange Money (DRC)
 */
export async function initiateMobileMoneyCharge(
    payload: MobileMoneyChargePayload
): Promise<ChargeResponse> {
    try {
        logger.info('Initiating mobile money charge', {
            amount: payload.amount,
            currency: payload.currency,
            network: payload.network,
        });

        // Validate phone number matches operator
        if (!validateOperator(payload.phone_number, payload.network)) {
            throw new Error(`Phone number does not match ${payload.network} network`);
        }

        // Format phone number to international format
        const formattedPhone = formatPhoneNumber(payload.phone_number);

        // Generate unique transaction reference
        const txRef = `paycongo_${Date.now()}_${Math.random().toString(36).substring(7)}`;

        const response = await flutterwaveClient.post<FlutterwaveChargeResponse>('/charges', {
            tx_ref: txRef,
            amount: payload.amount,
            currency: payload.currency,
            payment_type: 'mobilemoneyrwanda', // Flutterwave uses this for francophone mobile money
            phone_number: formattedPhone,
            email: payload.email,
            fullname: payload.fullname || 'PayCongo User',
            client_ip: '127.0.0.1',
            device_fingerprint: 'N/A',
            meta: {
                network: payload.network,
            },
        });

        if (response.status !== 'success') {
            throw new Error(response.message || 'Failed to initiate mobile money charge');
        }

        const data = response.data;

        return {
            transactionId: data.id.toString(),
            reference: data.tx_ref,
            status: mapFlutterwaveStatus(data.status),
            amount: data.amount,
            currency: data.currency,
            message: data.processor_response || response.message,
        };
    } catch (error: any) {
        logger.error('Failed to initiate mobile money charge', error);
        throw new Error(error.response?.data?.message || 'Failed to initiate mobile money charge');
    }
}

/**
 * Verify transaction status
 */
export async function verifyTransaction(transactionId: string): Promise<ChargeResponse> {
    try {
        logger.info('Verifying transaction', { transactionId });

        const response = await flutterwaveClient.get<FlutterwaveChargeResponse>(
            `/transactions/${transactionId}/verify`
        );

        if (response.status !== 'success') {
            throw new Error(response.message || 'Failed to verify transaction');
        }

        const data = response.data;

        return {
            transactionId: data.id.toString(),
            reference: data.tx_ref,
            status: mapFlutterwaveStatus(data.status),
            amount: data.amount,
            currency: data.currency,
            message: data.processor_response || response.message,
        };
    } catch (error: any) {
        logger.error('Failed to verify transaction', error);
        throw new Error(error.response?.data?.message || 'Failed to verify transaction');
    }
}

/**
 * Map Flutterwave status to our internal status
 */
function mapFlutterwaveStatus(status: string): 'pending' | 'successful' | 'failed' {
    const statusMap: Record<string, 'pending' | 'successful' | 'failed'> = {
        'successful': 'successful',
        'success': 'successful',
        'completed': 'successful',
        'pending': 'pending',
        'failed': 'failed',
        'cancelled': 'failed',
    };

    return statusMap[status.toLowerCase()] || 'pending';
}
