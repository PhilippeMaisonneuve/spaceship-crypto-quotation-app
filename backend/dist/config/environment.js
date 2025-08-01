"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.validateEnvironment = void 0;
require("dotenv/config");
/**
 * Validates required environment variables and returns configuration
 */
const validateEnvironment = () => {
    const requiredVars = ['COINGECKO_API_KEY'];
    const missing = requiredVars.filter(varName => !process.env[varName]);
    if (missing.length > 0) {
        console.error('❌ Missing required environment variables:');
        missing.forEach(varName => console.error(`   - ${varName}`));
        console.error('\n💡 Create a .env file based on .env.example');
        process.exit(1);
    }
    console.log('✅ Environment variables validated');
    return {
        port: parseInt(process.env.PORT || '3001', 10),
        coinGeckoApiKey: process.env.COINGECKO_API_KEY,
        coinGeckoBaseUrl: process.env.COINGECKO_BASE_URL || 'https://api.coingecko.com/api/v3',
        cacheDurationMs: parseInt(process.env.CACHE_DURATION_MS || '60000', 10), // 1 minute
        nodeEnv: process.env.NODE_ENV || 'development',
        databaseUrl: process.env.DATABASE_URL || 'file:./dev.db'
    };
};
exports.validateEnvironment = validateEnvironment;
// Export validated configuration
exports.config = (0, exports.validateEnvironment)();
