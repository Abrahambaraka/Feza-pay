export interface User {
    id: string;
    email: string;
    displayName: string;
    photoURL?: string;
    googleId?: string;
    passwordHash?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserCard {
    id: string;
    userId: string;
    number: string;
    expiry: string;
    cvv: string;
    balance: number;
    label: string;
    status: 'ACTIVE' | 'INACTIVE' | 'FROZEN' | 'TERMINATED';
    type: 'VISA' | 'MASTERCARD';
    createdAt: Date;
    updatedAt: Date;
}

export interface UserTransaction {
    id: string;
    userId: string;
    cardId?: string;
    type: 'PAYMENT' | 'DEPOSIT' | 'TRANSFER' | 'WITHDRAWAL';
    amount: number;
    currency: string;
    merchant: string;
    status: 'completed' | 'pending' | 'failed';
    createdAt: Date;
}

export interface CreateUserDTO {
    email: string;
    displayName: string;
    password?: string;
    googleId?: string;
    photoURL?: string;
}

export interface LoginDTO {
    email: string;
    password: string;
}

export interface JWTPayload {
    userId: string;
    email: string;
    displayName: string;
}
