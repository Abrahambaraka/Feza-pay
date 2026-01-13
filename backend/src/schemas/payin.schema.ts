import { z } from 'zod';
import { isValidDRCPhoneNumber } from '../utils/phoneValidator';

export const mobileMoneyChargeSchema = z.object({
    amount: z.number().min(1, 'Amount must be at least 1').max(100000, 'Amount cannot exceed 100000'),
    currency: z.enum(['USD', 'CDF'], {
        errorMap: () => ({ message: 'Currency must be either USD or CDF' }),
    }),
    phone_number: z.string().refine(isValidDRCPhoneNumber, {
        message: 'Invalid DRC phone number format. Must be 9 digits (e.g., 810000000) or 12 digits with country code (243810000000)',
    }),
    network: z.enum(['VODACOM', 'AIRTEL', 'ORANGE'], {
        errorMap: () => ({ message: 'Network must be VODACOM, AIRTEL, or ORANGE' }),
    }),
    email: z.string().email('Invalid email address'),
    fullname: z.string().min(2, 'Full name must be at least 2 characters').optional(),
});

export const verifyTransactionSchema = z.object({
    transactionId: z.string().min(1, 'Transaction ID is required'),
});

export type MobileMoneyChargeInput = z.infer<typeof mobileMoneyChargeSchema>;
export type VerifyTransactionInput = z.infer<typeof verifyTransactionSchema>;
