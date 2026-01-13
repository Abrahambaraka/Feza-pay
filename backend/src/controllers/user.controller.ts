import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { DatabaseService } from '../services/database.service';

export class UserController {
    // Get user's cards
    static async getCards(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.authUser?.userId;

            if (!userId) {
                res.status(401).json({
                    success: false,
                    error: 'Not authenticated',
                });
                return;
            }

            const cards = await DatabaseService.getCardsByUserId(userId);

            res.json({
                success: true,
                data: cards,
            });
        } catch (error: any) {
            console.error('Get cards error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get cards',
            });
        }
    }

    // Get user's transactions
    static async getTransactions(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.authUser?.userId;

            if (!userId) {
                res.status(401).json({
                    success: false,
                    error: 'Not authenticated',
                });
                return;
            }

            const transactions = await DatabaseService.getTransactionsByUserId(userId);

            res.json({
                success: true,
                data: transactions,
            });
        } catch (error: any) {
            console.error('Get transactions error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get transactions',
            });
        }
    }

    // Update user profile
    static async updateProfile(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.authUser?.userId;

            if (!userId) {
                res.status(401).json({
                    success: false,
                    error: 'Not authenticated',
                });
                return;
            }

            const { displayName, photoURL } = req.body;

            const updatedUser = await DatabaseService.updateUser(userId, {
                displayName,
                photoURL,
            } as any);

            if (!updatedUser) {
                res.status(404).json({
                    success: false,
                    error: 'User not found',
                });
                return;
            }

            res.json({
                success: true,
                data: {
                    id: updatedUser.id,
                    email: updatedUser.email,
                    displayName: updatedUser.displayName,
                    photoURL: updatedUser.photoURL,
                },
            });
        } catch (error: any) {
            console.error('Update profile error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to update profile',
            });
        }
    }

    // Create a transaction
    static async createTransaction(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.authUser?.userId;

            if (!userId) {
                res.status(401).json({
                    success: false,
                    error: 'Not authenticated',
                });
                return;
            }

            const { cardId, type, amount, currency, merchant, status } = req.body;

            const transaction = await DatabaseService.createTransaction({
                userId,
                cardId,
                type,
                amount,
                currency,
                merchant,
                status: status || 'completed',
            });

            res.status(201).json({
                success: true,
                data: transaction,
            });
        } catch (error: any) {
            console.error('Create transaction error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to create transaction',
            });
        }
    }

    // Update card balance
    static async updateCardBalance(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.authUser?.userId;

            if (!userId) {
                res.status(401).json({
                    success: false,
                    error: 'Not authenticated',
                });
                return;
            }

            const { cardId, balance } = req.body;

            if (!cardId || balance === undefined) {
                res.status(400).json({
                    success: false,
                    error: 'Card ID and balance are required',
                });
                return;
            }

            // Verify the card belongs to the user
            const cards = await DatabaseService.getCardsByUserId(userId);
            const cardExists = cards.some(c => c.id === cardId);

            if (!cardExists) {
                res.status(403).json({
                    success: false,
                    error: 'Card not found or does not belong to user',
                });
                return;
            }

            const updatedCard = await DatabaseService.updateCardBalance(cardId, balance);

            res.json({
                success: true,
                data: updatedCard,
            });
        } catch (error: any) {
            console.error('Update card balance error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to update card balance',
            });
        }
    }
}
