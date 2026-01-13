import { z } from 'zod';

export const createCardSchema = z.object({
    scheme: z.enum(['VISA', 'MASTERCARD'], {
        errorMap: () => ({ message: 'Scheme must be either VISA or MASTERCARD' }),
    }),
    currency: z.enum(['USD', 'CDF'], {
        errorMap: () => ({ message: 'Currency must be either USD or CDF' }),
    }),
    label: z.string().min(1).max(50).optional(),
    transactionId: z.string().optional(),
    amount: z.number().min(0).max(10000).optional(),
    billingName: z.string().min(2, 'Billing name must be at least 2 characters'),
    billingAddress: z.string().optional(),
    billingCity: z.string().optional(),
    billingState: z.string().optional(),
    billingPostalCode: z.string().optional(),
    billingCountry: z.string().length(2, 'Country code must be 2 characters').optional(),
});

export const cardIdSchema = z.object({
    cardId: z.string().min(1, 'Card ID is required'),
});

export const fundCardSchema = z.object({
    amount: z.number().min(1, 'Amount must be at least 1').max(10000, 'Amount cannot exceed 10000'),
});

export type CreateCardInput = z.infer<typeof createCardSchema>;
export type CardIdInput = z.infer<typeof cardIdSchema>;
export type FundCardInput = z.infer<typeof fundCardSchema>;
