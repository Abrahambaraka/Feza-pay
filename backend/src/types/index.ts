export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: {
        message: string;
        code?: string;
        details?: any;
    };
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
    pagination?: {
        page: number;
        limit: number;
        total: number;
        hasMore: boolean;
    };
}

// Flutterwave Types
export interface FlutterwaveCardResponse {
    id: string;
    account_id: number;
    amount: string;
    currency: string;
    card_hash: string;
    card_pan: string;
    masked_pan: string;
    city: string;
    state: string;
    address_1: string;
    address_2: string;
    zip_code: string;
    cvv: string;
    expiration: string;
    send_to: string;
    bin_check_name: string;
    card_type: string;
    name_on_card: string;
    created_at: string;
    is_active: boolean;
    callback_url: string;
}

export interface FlutterwaveChargeResponse {
    status: string;
    message: string;
    data: {
        id: number;
        tx_ref: string;
        flw_ref: string;
        device_fingerprint: string;
        amount: number;
        charged_amount: number;
        app_fee: number;
        merchant_fee: number;
        processor_response: string;
        auth_model: string;
        currency: string;
        ip: string;
        narration: string;
        status: string;
        payment_type: string;
        fraud_status: string;
        charge_type: string;
        created_at: string;
        account_id: number;
        customer: {
            id: number;
            phone_number: string;
            name: string;
            email: string;
            created_at: string;
        };
    };
}

// Internal Types
export interface VirtualCard {
    id: string;
    number: string;
    maskedNumber: string;
    last4: string;
    expiry: string;
    cvv?: string; // Only included in creation response
    balance: number;
    currency: string;
    label: string;
    status: 'ACTIVE' | 'FROZEN' | 'CANCELLED';
    type: 'VISA' | 'MASTERCARD';
    createdAt: string;
}

export interface Transaction {
    id: string;
    userId: string;
    type: 'DEPOSIT' | 'WITHDRAWAL' | 'PAYMENT' | 'TRANSFER';
    amount: number;
    currency: string;
    status: 'pending' | 'successful' | 'failed' | 'completed';
    merchant?: string;
    reference?: string;
    metadata?: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}

export interface KYCVerification {
    userId: string;
    documentType: 'voter' | 'passport';
    status: 'pending' | 'approved' | 'rejected';
    referenceId: string;
    riskScore?: number;
    reason?: string;
    submittedAt: string;
    verifiedAt?: string;
}

// Express Request Extensions
declare global {
    namespace Express {
        interface Request {
            user?: {
                uid: string;
                email?: string;
                name?: string;
            };
        }
    }
}
