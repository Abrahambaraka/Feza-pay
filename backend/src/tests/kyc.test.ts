import request from 'supertest';
import { describe, it, expect, jest } from '@jest/globals';
import app from '../index';

// Mock removed - Firebase no longer used
        verifyIdToken: (jest.fn() as any).mockResolvedValue({ uid: 'test-user', email: 'test@example.com' } as any),
    },
}));

describe('KYC Controller', () => {
    it('should return 401 if unauthorized', async () => {
        const response = await request(app).post('/kyc/verify').send({});
        expect(response.status).toBe(401);
    });

    it('should return KYC status if exists', async () => {
        (db.collection as any).mockReturnValue({
            doc: jest.fn().mockReturnValue({
                get: (jest.fn() as any).mockResolvedValue({
                    exists: true,
                    data: () => ({ status: 'approved', referenceId: 'ref_123' })
                } as any)
            })
        });

        const response = await request(app)
            .get('/kyc/status')
            .set('Authorization', 'Bearer valid-token');

        expect(response.status).toBe(200);
        expect(response.body.data.status).toBe('approved');
    });
});
