import dotenv from 'dotenv';

dotenv.config();

interface EnvCheck {
    name: string;
    required: boolean;
    category: string;
}

const envVars: EnvCheck[] = [
    // Database
    { name: 'POSTGRES_URL', required: false, category: 'Database' },
    { name: 'POSTGRES_URL_NON_POOLING', required: false, category: 'Database' },
    { name: 'DATABASE_URL', required: false, category: 'Database' },

    // JWT
    { name: 'JWT_SECRET', required: true, category: 'Authentication' },

    // Google OAuth
    { name: 'GOOGLE_CLIENT_ID', required: false, category: 'Google OAuth' },
    { name: 'GOOGLE_CLIENT_SECRET', required: false, category: 'Google OAuth' },
    { name: 'GOOGLE_CALLBACK_URL', required: false, category: 'Google OAuth' },

    // Frontend
    { name: 'FRONTEND_URL', required: true, category: 'Frontend' },

    // Payment Providers
    { name: 'CINETPAY_API_KEY', required: false, category: 'CinetPay' },
    { name: 'CINETPAY_SITE_ID', required: false, category: 'CinetPay' },
    { name: 'BITNOB_API_KEY', required: false, category: 'Bitnob' },
];

console.log('\n🔍 Checking Environment Variables...\n');

let hasErrors = false;
let hasWarnings = false;
const categories = new Map<string, { found: string[], missing: string[] }>();

// Check database connection
const hasDatabase = !!(
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.DATABASE_URL
);

if (!hasDatabase) {
    console.log('❌ CRITICAL: No database connection string found!');
    console.log('   Please set one of: POSTGRES_URL, POSTGRES_URL_NON_POOLING, or DATABASE_URL\n');
    hasErrors = true;
}

// Check all environment variables
envVars.forEach(({ name, required, category }) => {
    if (!categories.has(category)) {
        categories.set(category, { found: [], missing: [] });
    }

    const categoryData = categories.get(category)!;
    const value = process.env[name];

    if (value) {
        categoryData.found.push(name);
    } else {
        categoryData.missing.push(name);
        if (required) {
            hasErrors = true;
        } else {
            hasWarnings = true;
        }
    }
});

// Display results by category
categories.forEach((data, category) => {
    console.log(`\n📦 ${category}:`);

    if (data.found.length > 0) {
        data.found.forEach(name => {
            const value = process.env[name]!;
            const displayValue = value.length > 40
                ? `${value.substring(0, 40)}...`
                : value;
            console.log(`   ✅ ${name}: ${displayValue}`);
        });
    }

    if (data.missing.length > 0) {
        data.missing.forEach(name => {
            const envVar = envVars.find(v => v.name === name)!;
            const icon = envVar.required ? '❌' : '⚠️';
            const label = envVar.required ? 'REQUIRED' : 'Optional';
            console.log(`   ${icon} ${name}: Not set (${label})`);
        });
    }
});

// Summary
console.log('\n' + '='.repeat(60));
if (hasErrors) {
    console.log('❌ ERRORS FOUND: Some required environment variables are missing!');
    console.log('   Please configure them before deploying.\n');
    process.exit(1);
} else if (hasWarnings) {
    console.log('⚠️  WARNINGS: Some optional environment variables are missing.');
    console.log('   The app will work, but some features may be disabled.\n');
    process.exit(0);
} else {
    console.log('✅ All environment variables are configured!\n');
    process.exit(0);
}
