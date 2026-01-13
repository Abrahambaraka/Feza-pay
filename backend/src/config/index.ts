import dotenv from 'dotenv';

dotenv.config();

interface Config {
    port: number;
    nodeEnv: string;
    flutterwave: {
        publicKey: string;
        secretKey: string;
        encryptionKey: string;
        webhookHash: string;
    };
    google: {
        clientId: string;
        clientSecret: string;
        callbackUrl: string;
    };
    jwt: {
        secret: string;
        expiresIn: string;
    };
    cors: {
        allowedOrigins: string[];
    };
    rateLimit: {
        windowMs: number;
        maxRequests: number;
    };
    logLevel: string;
    frontendUrl: string;
}


const getEnvVar = (key: string, defaultValue?: string): string => {
    const value = process.env[key] !== undefined ? process.env[key] as string : defaultValue;
    if (value === undefined) {
        console.error(`❌ CRITICAL: Missing required environment variable: ${key}. Please set it in Vercel Environment Variables.`);
        return '';
    }
    return value;
};

export const config: Config = {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',

    flutterwave: {
        publicKey: getEnvVar('FLW_PUBLIC_KEY'),
        secretKey: getEnvVar('FLW_SECRET_KEY'),
        encryptionKey: getEnvVar('FLW_ENCRYPTION_KEY'),
        webhookHash: getEnvVar('FLW_WEBHOOK_HASH', ''),
    },

    google: {
        clientId: getEnvVar('GOOGLE_CLIENT_ID'),
        clientSecret: getEnvVar('GOOGLE_CLIENT_SECRET'),
        callbackUrl: getEnvVar('GOOGLE_CALLBACK_URL', 'http://localhost:3000/auth/google/callback'),
    },

    jwt: {
        secret: getEnvVar('JWT_SECRET', 'your-secret-key-change-in-production'),
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },

    cors: {
        allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(','),
    },

    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '20', 10),
    },

    logLevel: process.env.LOG_LEVEL || 'info',

    frontendUrl: getEnvVar('FRONTEND_URL', 'http://localhost:5173'),
};

