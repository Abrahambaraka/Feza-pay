/**
 * Validate and format DRC phone numbers
 */

const DRC_COUNTRY_CODE = '243';

// DRC mobile operator prefixes
const OPERATOR_PREFIXES = {
    VODACOM: ['81', '82', '83', '84', '85'],
    AIRTEL: ['97', '98', '99'],
    ORANGE: ['89', '90', '91'],
};

export type MobileOperator = 'VODACOM' | 'AIRTEL' | 'ORANGE';

/**
 * Validate DRC phone number format
 * @param phoneNumber - Phone number to validate
 * @returns true if valid
 */
export function isValidDRCPhoneNumber(phoneNumber: string): boolean {
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');

    // Check if it starts with 243 (DRC country code)
    if (cleaned.startsWith(DRC_COUNTRY_CODE)) {
        // Should be 12 digits total (243 + 9 digits)
        return cleaned.length === 12;
    }

    // Or if it's just the local number (9 digits starting with operator prefix)
    if (cleaned.length === 9) {
        const prefix = cleaned.substring(0, 2);
        return Object.values(OPERATOR_PREFIXES).flat().includes(prefix);
    }

    return false;
}

/**
 * Format phone number to international format (243XXXXXXXXX)
 * @param phoneNumber - Phone number to format
 * @returns Formatted phone number
 */
export function formatPhoneNumber(phoneNumber: string): string {
    const cleaned = phoneNumber.replace(/\D/g, '');

    if (cleaned.startsWith(DRC_COUNTRY_CODE)) {
        return cleaned;
    }

    // Add country code if missing
    if (cleaned.length === 9) {
        return `${DRC_COUNTRY_CODE}${cleaned}`;
    }

    throw new Error('Invalid phone number format');
}

/**
 * Detect mobile operator from phone number
 * @param phoneNumber - Phone number to check
 * @returns Operator name or null
 */
export function detectOperator(phoneNumber: string): MobileOperator | null {
    const cleaned = phoneNumber.replace(/\D/g, '');
    let localNumber = cleaned;

    // Remove country code if present
    if (cleaned.startsWith(DRC_COUNTRY_CODE)) {
        localNumber = cleaned.substring(3);
    }

    const prefix = localNumber.substring(0, 2);

    for (const [operator, prefixes] of Object.entries(OPERATOR_PREFIXES)) {
        if (prefixes.includes(prefix)) {
            return operator as MobileOperator;
        }
    }

    return null;
}

/**
 * Validate phone number matches expected operator
 * @param phoneNumber - Phone number to validate
 * @param expectedOperator - Expected operator
 * @returns true if matches
 */
export function validateOperator(phoneNumber: string, expectedOperator: MobileOperator): boolean {
    const detected = detectOperator(phoneNumber);
    return detected === expectedOperator;
}
