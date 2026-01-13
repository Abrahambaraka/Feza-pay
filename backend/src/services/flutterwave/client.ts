import axios, { AxiosInstance, AxiosError } from 'axios';
import { config } from '../../config';
import { logger } from '../../utils/logger';

/**
 * Flutterwave API Client
 * Base client for all Flutterwave API calls
 */
class FlutterwaveClient {
    private client: AxiosInstance;
    private baseURL = 'https://api.flutterwave.com/v3';

    constructor() {
        this.client = axios.create({
            baseURL: this.baseURL,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.flutterwave.secretKey}`,
            },
            timeout: 30000, // 30 seconds
        });

        // Request interceptor for logging
        this.client.interceptors.request.use(
            (config) => {
                logger.debug('Flutterwave API Request', {
                    method: config.method,
                    url: config.url,
                    data: config.data,
                });
                return config;
            },
            (error) => {
                logger.error('Flutterwave request error', error);
                return Promise.reject(error);
            }
        );

        // Response interceptor for logging and error handling
        this.client.interceptors.response.use(
            (response) => {
                logger.debug('Flutterwave API Response', {
                    status: response.status,
                    data: response.data,
                });
                return response;
            },
            (error: AxiosError) => {
                this.handleError(error);
                return Promise.reject(error);
            }
        );
    }

    private handleError(error: AxiosError): void {
        if (error.response) {
            // Server responded with error status
            logger.error('Flutterwave API error', {
                status: error.response.status,
                data: error.response.data,
            });
        } else if (error.request) {
            // Request made but no response
            logger.error('Flutterwave no response', {
                request: error.request,
            });
        } else {
            // Error in request setup
            logger.error('Flutterwave request setup error', {
                message: error.message,
            });
        }
    }

    /**
     * Make GET request to Flutterwave API
     */
    async get<T = any>(url: string, params?: any): Promise<T> {
        const response = await this.client.get(url, { params });
        return response.data;
    }

    /**
     * Make POST request to Flutterwave API
     */
    async post<T = any>(url: string, data?: any): Promise<T> {
        const response = await this.client.post(url, data);
        return response.data;
    }

    /**
     * Make PUT request to Flutterwave API
     */
    async put<T = any>(url: string, data?: any): Promise<T> {
        const response = await this.client.put(url, data);
        return response.data;
    }

    /**
     * Make DELETE request to Flutterwave API
     */
    async delete<T = any>(url: string): Promise<T> {
        const response = await this.client.delete(url);
        return response.data;
    }
}

// Export singleton instance
export const flutterwaveClient = new FlutterwaveClient();
