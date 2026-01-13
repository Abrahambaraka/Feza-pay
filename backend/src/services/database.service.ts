import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';
import { User, UserCard, UserTransaction, CreateUserDTO } from '../models/user.model';

const SALT_ROUNDS = 10;

export class DatabaseService {
    // Initialize database tables
    static async initializeTables(): Promise<void> {
        try {
            // Users table
            await sql`
                CREATE TABLE IF NOT EXISTS users (
                    id VARCHAR(255) PRIMARY KEY,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    display_name VARCHAR(255) NOT NULL,
                    photo_url TEXT,
                    google_id VARCHAR(255) UNIQUE,
                    password_hash TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `;

            // Cards table
            await sql`
                CREATE TABLE IF NOT EXISTS user_cards (
                    id VARCHAR(255) PRIMARY KEY,
                    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    number VARCHAR(16) NOT NULL,
                    expiry VARCHAR(7) NOT NULL,
                    cvv VARCHAR(4) NOT NULL,
                    balance DECIMAL(12, 2) DEFAULT 0,
                    label VARCHAR(255) NOT NULL,
                    status VARCHAR(50) DEFAULT 'ACTIVE',
                    type VARCHAR(50) DEFAULT 'VISA',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `;

            // Transactions table
            await sql`
                CREATE TABLE IF NOT EXISTS user_transactions (
                    id VARCHAR(255) PRIMARY KEY,
                    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    card_id VARCHAR(255) REFERENCES user_cards(id) ON DELETE SET NULL,
                    type VARCHAR(50) NOT NULL,
                    amount DECIMAL(12, 2) NOT NULL,
                    currency VARCHAR(10) NOT NULL,
                    merchant VARCHAR(255) NOT NULL,
                    status VARCHAR(50) DEFAULT 'pending',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `;

            // Create indexes
            await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`;
            await sql`CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id)`;
            await sql`CREATE INDEX IF NOT EXISTS idx_cards_user_id ON user_cards(user_id)`;
            await sql`CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON user_transactions(user_id)`;

            console.log('✅ Database tables initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing database tables:', error);
            throw error;
        }
    }

    // User operations
    static async createUser(userData: CreateUserDTO): Promise<User> {
        const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const passwordHash = userData.password ? await bcrypt.hash(userData.password, SALT_ROUNDS) : null;

        const result = await sql`
            INSERT INTO users (id, email, display_name, photo_url, google_id, password_hash)
            VALUES (${id}, ${userData.email}, ${userData.displayName}, ${userData.photoURL || null}, ${userData.googleId || null}, ${passwordHash})
            RETURNING *
        `;

        return this.mapRowToUser(result.rows[0]);
    }

    static async findUserByEmail(email: string): Promise<User | null> {
        const result = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`;
        return result.rows.length > 0 ? this.mapRowToUser(result.rows[0]) : null;
    }

    static async findUserByGoogleId(googleId: string): Promise<User | null> {
        const result = await sql`SELECT * FROM users WHERE google_id = ${googleId} LIMIT 1`;
        return result.rows.length > 0 ? this.mapRowToUser(result.rows[0]) : null;
    }

    static async findUserById(id: string): Promise<User | null> {
        const result = await sql`SELECT * FROM users WHERE id = ${id} LIMIT 1`;
        return result.rows.length > 0 ? this.mapRowToUser(result.rows[0]) : null;
    }

    static async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
        const { displayName, photoURL } = updates;
        const result = await sql`
            UPDATE users 
            SET display_name = COALESCE(${displayName}, display_name),
                photo_url = COALESCE(${photoURL || null}, photo_url),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ${id}
            RETURNING *
        `;
        return result.rows.length > 0 ? this.mapRowToUser(result.rows[0]) : null;
    }

    static async verifyPassword(email: string, password: string): Promise<User | null> {
        const user = await this.findUserByEmail(email);
        if (!user || !user.passwordHash) {
            return null;
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        return isValid ? user : null;
    }

    // Card operations
    static async createCard(cardData: Omit<UserCard, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserCard> {
        const id = `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const result = await sql`
            INSERT INTO user_cards (id, user_id, number, expiry, cvv, balance, label, status, type)
            VALUES (${id}, ${cardData.userId}, ${cardData.number}, ${cardData.expiry}, ${cardData.cvv}, 
                    ${cardData.balance}, ${cardData.label}, ${cardData.status}, ${cardData.type})
            RETURNING *
        `;

        return this.mapRowToCard(result.rows[0]);
    }

    static async getCardsByUserId(userId: string): Promise<UserCard[]> {
        const result = await sql`SELECT * FROM user_cards WHERE user_id = ${userId} ORDER BY created_at DESC`;
        return result.rows.map(this.mapRowToCard);
    }

    static async updateCardBalance(cardId: string, newBalance: number): Promise<UserCard | null> {
        const result = await sql`
            UPDATE user_cards 
            SET balance = ${newBalance}, updated_at = CURRENT_TIMESTAMP
            WHERE id = ${cardId}
            RETURNING *
        `;
        return result.rows.length > 0 ? this.mapRowToCard(result.rows[0]) : null;
    }

    // Transaction operations
    static async createTransaction(txData: Omit<UserTransaction, 'id' | 'createdAt'>): Promise<UserTransaction> {
        const id = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const result = await sql`
            INSERT INTO user_transactions (id, user_id, card_id, type, amount, currency, merchant, status)
            VALUES (${id}, ${txData.userId}, ${txData.cardId || null}, ${txData.type}, ${txData.amount}, 
                    ${txData.currency}, ${txData.merchant}, ${txData.status})
            RETURNING *
        `;

        return this.mapRowToTransaction(result.rows[0]);
    }

    static async getTransactionsByUserId(userId: string): Promise<UserTransaction[]> {
        const result = await sql`
            SELECT * FROM user_transactions 
            WHERE user_id = ${userId} 
            ORDER BY created_at DESC
        `;
        return result.rows.map(this.mapRowToTransaction);
    }

    // Helper methods to map database rows to models
    private static mapRowToUser(row: any): User {
        return {
            id: row.id,
            email: row.email,
            displayName: row.display_name,
            photoURL: row.photo_url,
            googleId: row.google_id,
            passwordHash: row.password_hash,
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at),
        };
    }

    private static mapRowToCard(row: any): UserCard {
        return {
            id: row.id,
            userId: row.user_id,
            number: row.number,
            expiry: row.expiry,
            cvv: row.cvv,
            balance: parseFloat(row.balance),
            label: row.label,
            status: row.status,
            type: row.type,
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at),
        };
    }

    private static mapRowToTransaction(row: any): UserTransaction {
        return {
            id: row.id,
            userId: row.user_id,
            cardId: row.card_id,
            type: row.type,
            amount: parseFloat(row.amount),
            currency: row.currency,
            merchant: row.merchant,
            status: row.status,
            createdAt: new Date(row.created_at),
        };
    }
}
