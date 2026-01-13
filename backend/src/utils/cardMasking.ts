/**
 * Mask card PAN to show only last 4 digits
 * @param pan - Full card number
 * @returns Masked card number (e.g., "****1234")
 */
export function maskCardNumber(pan: string): string {
    if (!pan || pan.length < 4) {
        return '****';
    }
    const last4 = pan.slice(-4);
    return `****${last4}`;
}

/**
 * Mask CVV completely
 * @param _cvv - Card CVV
 * @returns Masked CVV (always "***")
 */
export function maskCVV(_cvv: string): string {
    return '***';
}

/**
 * Extract last 4 digits of card number
 * @param pan - Full card number
 * @returns Last 4 digits
 */
export function getLast4Digits(pan: string): string {
    if (!pan || pan.length < 4) {
        return '';
    }
    return pan.slice(-4);
}

/**
 * Validate card number format (basic check)
 * @param pan - Card number to validate
 * @returns true if valid format
 */
export function isValidCardNumber(pan: string): boolean {
    // Remove spaces and dashes
    const cleaned = pan.replace(/[\s-]/g, '');

    // Check if it's all digits and between 13-19 characters
    return /^\d{13,19}$/.test(cleaned);
}
