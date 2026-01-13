import request from 'supertest';
import { describe, it, expect } from '@jest/globals';
import app from '../index';

// Firebase removed - no mocks needed

describe('Issuing Controller', () => {
  it('should return 401 if unauthorized', async () => {
    const response = await request(app).post('/issuing/cards').send({});
    expect(response.status).toBe(401);
  });

  // More tests to be added as we refine the mock state
});
