import { Request, Response } from 'express';
import { google } from 'googleapis';
import { config } from '../config/index.js';
import { DatabaseService } from '../services/database.service.js';
import { generateToken } from '../utils/jwt.utils.js';
import { LoginDTO, CreateUserDTO } from '../models/user.model.js';

const oauth2Client = new google.auth.OAuth2(
    config.google.clientId,
    config.google.clientSecret,
    config.google.callbackUrl
);

export class AuthController {
    // Initiate Google OAuth flow
    static initiateGoogleAuth(_req: Request, res: Response): void {
        try {
            if (!config.google.clientId || !config.google.clientSecret) {
                console.error('❌ Google OAuth Error: Missing client ID or secret');
                res.status(500).json({
                    success: false,
                    error: 'Google login configuration is missing'
                });
                return;
            }

            const scopes = [
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile',
            ];

            const authUrl = oauth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: scopes,
                prompt: 'consent',
            });

            // Redirect directly to Google auth page
            res.redirect(authUrl);
        } catch (error: any) {
            console.error('Google OAuth initiation error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to initiate Google login'
            });
        }
    }

    // Handle Google OAuth callback
    static async handleGoogleCallback(req: Request, res: Response): Promise<void> {
        try {
            const { code } = req.query;

            if (!code || typeof code !== 'string') {
                res.redirect(`${config.frontendUrl}/?error=missing_code`);
                return;
            }

            // Exchange code for tokens
            const { tokens } = await oauth2Client.getToken(code);
            oauth2Client.setCredentials(tokens);

            // Get user info from Google
            const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
            const { data: googleUser } = await oauth2.userinfo.get();

            if (!googleUser.email) {
                res.redirect(`${config.frontendUrl}/?error=no_email`);
                return;
            }

            // Check if user exists
            let user = await DatabaseService.findUserByGoogleId(googleUser.id!);

            if (!user) {
                // Also check by email in case user signed up with password first
                user = await DatabaseService.findUserByEmail(googleUser.email);

                if (!user) {
                    // Create new user
                    const createUserData: CreateUserDTO = {
                        email: googleUser.email,
                        displayName: googleUser.name || googleUser.email.split('@')[0],
                        googleId: googleUser.id ?? undefined,
                        photoURL: googleUser.picture ?? undefined,
                    };
                    user = await DatabaseService.createUser(createUserData);
                }
            }

            // Generate JWT
            const token = generateToken({
                userId: user.id,
                email: user.email,
                displayName: user.displayName,
            });

            // Redirect to frontend with token
            res.redirect(`${config.frontendUrl}/auth/callback?token=${token}`);
        } catch (error: any) {
            // Log complet pour debug Vercel
            console.error('Google OAuth callback error:', error && (error.stack || error.message || error));
            if (error.response && error.response.data) {
                console.error('Google OAuth error response data:', error.response.data);
            }
            res.redirect(`${config.frontendUrl}/?error=auth_failed`);
        }
    }

    // Email/Password signup
    static async signup(req: Request, res: Response): Promise<void> {
        try {
            const { email, password, displayName } = req.body as CreateUserDTO & { password: string };

            if (!email || !password || !displayName) {
                res.status(400).json({
                    success: false,
                    error: 'Email, password, and display name are required',
                });
                return;
            }

            // Check if user already exists
            const existingUser = await DatabaseService.findUserByEmail(email);
            if (existingUser) {
                res.status(400).json({
                    success: false,
                    error: 'User with this email already exists',
                });
                return;
            }

            // Create user
            const user = await DatabaseService.createUser({
                email,
                password,
                displayName,
            });

            // Generate JWT
            const token = generateToken({
                userId: user.id,
                email: user.email,
                displayName: user.displayName,
            });

            res.status(201).json({
                success: true,
                data: {
                    token,
                    user: {
                        id: user.id,
                        email: user.email,
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                    },
                },
            });
        } catch (error: any) {
            console.error('Signup error:', error);

            // Provide specific error message for database configuration issues
            if (error.message && error.message.includes('Database not configured')) {
                res.status(503).json({
                    success: false,
                    error: 'Database service unavailable',
                    details: 'Please configure the database connection in Vercel environment variables (POSTGRES_URL_NON_POOLING, POSTGRES_URL, or DATABASE_URL)',
                });
                return;
            }

            res.status(500).json({
                success: false,
                error: 'Failed to create user',
                details: error.message || 'Unknown error',
            });
        }
    }

    // Email/Password login
    static async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body as LoginDTO;

            if (!email || !password) {
                res.status(400).json({
                    success: false,
                    error: 'Email and password are required',
                });
                return;
            }

            // Verify password
            const user = await DatabaseService.verifyPassword(email, password);

            if (!user) {
                res.status(401).json({
                    success: false,
                    error: 'Invalid credentials',
                });
                return;
            }

            // Generate JWT
            const token = generateToken({
                userId: user.id,
                email: user.email,
                displayName: user.displayName,
            });

            res.json({
                success: true,
                data: {
                    token,
                    user: {
                        id: user.id,
                        email: user.email,
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                    },
                },
            });
        } catch (error: any) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to login',
            });
        }
    }

    // Get current user info from token
    static async getCurrentUser(req: Request, res: Response): Promise<void> {
        try {
            // @ts-ignore - user is added to request by auth middleware
            const userId = (req as any).authUser?.userId;

            if (!userId) {
                res.status(401).json({
                    success: false,
                    error: 'Not authenticated',
                });
                return;
            }

            const user = await DatabaseService.findUserById(userId);

            if (!user) {
                res.status(404).json({
                    success: false,
                    error: 'User not found',
                });
                return;
            }

            res.json({
                success: true,
                data: {
                    id: user.id,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                },
            });
        } catch (error: any) {
            console.error('Get current user error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get user',
            });
        }
    }

    // Logout (client-side token removal, but we can provide endpoint for consistency)
    static logout(_req: Request, res: Response): Promise<void> {
        res.json({
            success: true,
            message: 'Logged out successfully',
        });
        return Promise.resolve();
    }
}
