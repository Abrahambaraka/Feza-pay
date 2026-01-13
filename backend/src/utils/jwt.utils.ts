import jwt from 'jsonwebtoken';
import { JWTPayload } from '../models/user.model';
import { config } from '../config';

export const generateToken = (payload: JWTPayload): string => {
    return jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
    });
};

export const verifyToken = (token: string): JWTPayload => {
    try {
        const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;
        return decoded;
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

export const extractTokenFromHeader = (authHeader?: string): string | null => {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.substring(7);
};
