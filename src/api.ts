import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || '/api';

class ApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Add JWT token to requests
        this.client.interceptors.request.use((config) => {
            const token = this.getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        // Handle token expiration
        this.client.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    // Token expired or invalid
                    this.removeToken();
                    window.location.href = '/';
                }
                return Promise.reject(error);
            }
        );
    }

    private getToken(): string | null {
        return localStorage.getItem('auth_token');
    }

    private setToken(token: string): void {
        localStorage.setItem('auth_token', token);
    }

    private removeToken(): void {
        localStorage.removeItem('auth_token');
    }

    // Auth methods
    async getCurrentUser() {
        const response = await this.client.get('/auth/me');
        return response.data.data;
    }

    async logout() {
        await this.client.post('/auth/logout');
        this.removeToken();
    }

    async signup(email: string, password: string, displayName: string) {
        const response = await this.client.post('/auth/signup', {
            email,
            password,
            displayName,
        });
        if (response.data.data.token) {
            this.setToken(response.data.data.token);
        }
        return response.data.data;
    }

    async login(email: string, password: string) {
        const response = await this.client.post('/auth/login', {
            email,
            password,
        });
        if (response.data.data.token) {
            this.setToken(response.data.data.token);
        }
        return response.data.data;
    }

    initiateGoogleLogin() {
        window.location.href = `${API_BASE_URL}/auth/google`;
    }

    setAuthToken(token: string) {
        this.setToken(token);
    }

    // User cards
    async getCards() {
        const response = await this.client.get('/user/cards');
        return response.data.data;
    }

    // User transactions
    async getTransactions() {
        const response = await this.client.get('/user/transactions');
        return response.data.data;
    }

    // Update profile
    async updateProfile(displayName: string, photoURL?: string) {
        const response = await this.client.put('/user/profile', {
            displayName,
            photoURL,
        });
        return response.data.data;
    }

    // Create transaction
    async createTransaction(data: {
        cardId?: string;
        type: string;
        amount: number;
        currency: string;
        merchant: string;
        status?: string;
    }) {
        const response = await this.client.post('/user/transactions', data);
        return response.data.data;
    }

    // Update card balance
    async updateCardBalance(cardId: string, balance: number) {
        const response = await this.client.put('/user/cards/balance', {
            cardId,
            balance,
        });
        return response.data.data;
    }
}

export const api = new ApiClient();
