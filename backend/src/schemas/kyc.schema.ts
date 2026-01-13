import { z } from 'zod';

export const kycVerifySchema = z.object({
    documentType: z.enum(['voter', 'passport'], {
        errorMap: () => ({ message: 'Document type must be either "voter" or "passport"' }),
    }),
    frontImageUrl: z.string().url({ message: 'Front image URL must be a valid URL' }),
    backImageUrl: z.string().url({ message: 'Back image URL must be a valid URL' }).optional(),
    fullName: z.string().min(2, 'Full name must be at least 2 characters').optional(),
    dateOfBirth: z.string().optional(),
});

export type KycVerifyInput = z.infer<typeof kycVerifySchema>;
