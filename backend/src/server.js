"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config"); // Add this as the FIRST import
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const axios_1 = __importDefault(require("axios"));
const client_1 = require("@prisma/client");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
const prisma = new client_1.PrismaClient();
// 🔒 SECURITY FIX: Use environment variables
const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY;
const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';
const CACHE_DURATION_MS = 60 * 1000; // 1 minute in milliseconds
// Validate required environment variables
if (!COINGECKO_API_KEY) {
    console.error('❌ Error: COINGECKO_API_KEY environment variable is required');
    process.exit(1);
}
// Prevent concurrent cache updates
let isCacheUpdating = false;
// Shared headers for Demo API authentication
const defaultHeaders = {
    'x-cg-demo-api-key': COINGECKO_API_KEY
};
// Helper function to check if cache is still valid (less than 1 minute old)
const isCacheValid = (cachedAt) => {
    const now = new Date();
    const cacheAge = now.getTime() - cachedAt.getTime();
    return cacheAge < CACHE_DURATION_MS;
};
// Environment validation
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
};
// Call validation on startup
validateEnvironment();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Crypto API is running', timestamp: new Date().toISOString() });
});
// Test endpoint
app.get('/api/test', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const ping = yield axios_1.default.get(`${COINGECKO_BASE_URL}/ping`, { headers: defaultHeaders });
        const markets = yield axios_1.default.get(`${COINGECKO_BASE_URL}/coins/markets`, {
            headers: defaultHeaders,
            params: {
                vs_currency: 'usd',
                per_page: 250,
                page: 1,
                sparkline: false,
                locale: 'en'
            }
        });
        res.json({
            success: true,
            ping: ping.data,
            markets_count: markets.data.length,
            timestamp: new Date().toISOString()
        });
    }
    catch (err) {
        res.status(((_a = err.response) === null || _a === void 0 ? void 0 : _a.status) || 500).json({
            success: false,
            status: (_b = err.response) === null || _b === void 0 ? void 0 : _b.status,
            error: ((_c = err.response) === null || _c === void 0 ? void 0 : _c.data) || err.message
        });
    }
}));
// Fetch first 1000 cryptos (4 pages of 250 each) with caching
app.get('/api/cryptos/all', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const forceRefresh = req.query.refresh; // Check if refresh parameter is present
        // Check if we have valid cached data (unless force refresh is requested)
        if (!forceRefresh) {
            const cachedData = yield prisma.cryptoListCache.findMany({
                orderBy: { market_cap_rank: 'asc' }
            });
            // If we have cached data, check if the newest entry is still valid
            if (cachedData.length > 0) {
                const newestCache = cachedData.reduce((newest, current) => current.cachedAt > newest.cachedAt ? current : newest);
                if (isCacheValid(newestCache.cachedAt)) {
                    console.log(`Serving ${cachedData.length} cryptocurrencies from cache`);
                    const formattedData = cachedData.map((c) => ({
                        id: c.cryptoId,
                        symbol: c.symbol,
                        name: c.name,
                        current_price: c.current_price,
                        price_change_percentage_24h: c.price_change_percentage_24h,
                        market_cap: c.market_cap,
                        volume_24h: c.volume_24h,
                        image: c.image,
                        market_cap_rank: c.market_cap_rank
                    }));
                    return res.json({
                        success: true,
                        total_count: formattedData.length,
                        data: formattedData,
                        cached: true,
                        timestamp: newestCache.cachedAt.toISOString()
                    });
                }
            }
        }
        // Cache is expired, doesn't exist, or refresh was forced
        const refreshReason = forceRefresh ? 'Force refresh requested' : 'Cache expired or missing';
        // Check if cache is already being updated
        if (isCacheUpdating) {
            console.log('Cache update already in progress, serving existing cache...');
            // Try to serve existing cache while update is in progress
            const cachedData = yield prisma.cryptoListCache.findMany({
                orderBy: { market_cap_rank: 'asc' }
            });
            if (cachedData.length > 0) {
                const formattedData = cachedData.map((c) => ({
                    id: c.cryptoId,
                    symbol: c.symbol,
                    name: c.name,
                    current_price: c.current_price,
                    price_change_percentage_24h: c.price_change_percentage_24h,
                    market_cap: c.market_cap,
                    volume_24h: c.volume_24h,
                    image: c.image,
                    market_cap_rank: c.market_cap_rank
                }));
                return res.json({
                    success: true,
                    total_count: formattedData.length,
                    data: formattedData,
                    cached: true,
                    updating: true,
                    timestamp: new Date().toISOString()
                });
            }
        }
        isCacheUpdating = true;
        console.log(`${refreshReason}, fetching fresh data from API...`);
        const perPage = 250;
        const totalPages = 4; // 4 pages × 250 = 1000 coins
        // ⚡ PERFORMANCE FIX: Parallel API calls instead of sequential
        console.log(`Making ${totalPages} parallel API calls for faster data fetching...`);
        const startTime = Date.now();
        const apiCalls = Array.from({ length: totalPages }, (_, index) => {
            const page = index + 1;
            return axios_1.default.get(`${COINGECKO_BASE_URL}/coins/markets`, {
                headers: defaultHeaders,
                params: {
                    vs_currency: 'usd',
                    order: 'market_cap_desc',
                    per_page: perPage,
                    page,
                    sparkline: false,
                    locale: 'en'
                }
            });
        });
        // Execute all API calls in parallel
        const responses = yield Promise.all(apiCalls);
        const all = [];
        responses.forEach((resp, index) => {
            const page = index + 1;
            const data = resp.data;
            if (Array.isArray(data) && data.length > 0) {
                all.push(...data);
                console.log(`Page ${page}: Added ${data.length} coins`);
            }
        });
        const fetchTime = Date.now() - startTime;
        console.log(`✅ Parallel fetch completed in ${fetchTime}ms. Total coins: ${all.length}`);
        // Clear old cache and insert new data in a transaction
        const cacheData = all.map((c) => ({
            cryptoId: c.id,
            symbol: c.symbol.toUpperCase(),
            name: c.name,
            current_price: c.current_price,
            price_change_percentage_24h: c.price_change_percentage_24h,
            market_cap: c.market_cap,
            volume_24h: c.total_volume,
            image: c.image,
            market_cap_rank: c.market_cap_rank
        }));
        // ⚡ PERFORMANCE FIX: Batch database operations instead of sequential
        console.log('Updating cache with batch operations...');
        const dbStartTime = Date.now();
        // Use transaction for atomic updates and better performance
        yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // Clear old cache first
            yield tx.cryptoListCache.deleteMany({});
            // Batch insert new data (much faster than individual upserts)
            yield tx.cryptoListCache.createMany({
                data: cacheData
            });
        }));
        const dbTime = Date.now() - dbStartTime;
        console.log(`✅ Database update completed in ${dbTime}ms`);
        const cryptoData = all.map((c) => ({
            id: c.id,
            symbol: c.symbol.toUpperCase(),
            name: c.name,
            current_price: c.current_price,
            price_change_percentage_24h: c.price_change_percentage_24h,
            market_cap: c.market_cap,
            volume_24h: c.total_volume,
            image: c.image,
            market_cap_rank: c.market_cap_rank
        }));
        console.log(`Successfully fetched and cached ${cryptoData.length} cryptocurrencies`);
        isCacheUpdating = false; // Release lock
        res.json({
            success: true,
            total_count: cryptoData.length,
            data: cryptoData,
            cached: false,
            timestamp: new Date().toISOString()
        });
    }
    catch (err) {
        console.error('API call failed:', err.message);
        // Try to return cached data as fallback, even if expired
        try {
            const cachedData = yield prisma.cryptoListCache.findMany({
                orderBy: { market_cap_rank: 'asc' }
            });
            if (cachedData.length > 0) {
                const newestCache = cachedData.reduce((newest, current) => current.cachedAt > newest.cachedAt ? current : newest);
                console.log(`API failed, serving ${cachedData.length} cryptocurrencies from cache (last updated: ${newestCache.cachedAt})`);
                const formattedData = cachedData.map((c) => ({
                    id: c.cryptoId,
                    symbol: c.symbol,
                    name: c.name,
                    current_price: c.current_price,
                    price_change_percentage_24h: c.price_change_percentage_24h,
                    market_cap: c.market_cap,
                    volume_24h: c.volume_24h,
                    image: c.image,
                    market_cap_rank: c.market_cap_rank
                }));
                return res.json({
                    success: true,
                    total_count: formattedData.length,
                    data: formattedData,
                    cached: true,
                    stale: true, // Indicates this is fallback data
                    timestamp: newestCache.cachedAt.toISOString(),
                    warning: 'API temporarily unavailable, serving cached data'
                });
            }
        }
        catch (cacheErr) {
            console.error('Failed to retrieve cache as fallback:', cacheErr);
        }
        // If no cache available, return error
        isCacheUpdating = false; // Release lock
        const status = ((_a = err.response) === null || _a === void 0 ? void 0 : _a.status) || 500;
        let msg = 'Failed to fetch data';
        if (status === 429)
            msg = 'Rate limit exceeded – too many requests';
        else if (status === 401)
            msg = 'Authentication failed – check your API key';
        res.status(status).json({
            success: false,
            status,
            error: msg,
            details: ((_b = err.response) === null || _b === void 0 ? void 0 : _b.data) || err.message
        });
    }
    finally {
        isCacheUpdating = false; // Ensure lock is always released
    }
}));
// Paginated list endpoint
app.get('/api/cryptos', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const page = parseInt(req.query.page || '1');
        const perPage = parseInt(req.query.per_page || '100');
        const resp = yield axios_1.default.get(`${COINGECKO_BASE_URL}/coins/markets`, {
            headers: defaultHeaders,
            params: {
                vs_currency: 'usd',
                order: 'market_cap_desc',
                per_page: perPage,
                page,
                sparkline: false,
                locale: 'en'
            }
        });
        const data = resp.data;
        const formatted = data.map((c) => ({
            id: c.id,
            symbol: c.symbol.toUpperCase(),
            name: c.name,
            current_price: c.current_price,
            price_change_percentage_24h: c.price_change_percentage_24h,
            market_cap: c.market_cap,
            volume_24h: c.total_volume,
            image: c.image,
            market_cap_rank: c.market_cap_rank
        }));
        res.json({
            success: true,
            data: formatted,
            pagination: {
                page,
                per_page: perPage,
                has_next: data.length === perPage,
                has_prev: page > 1
            },
            timestamp: new Date().toISOString()
        });
    }
    catch (err) {
        const status = ((_a = err.response) === null || _a === void 0 ? void 0 : _a.status) || 500;
        let msg = ((_b = err.response) === null || _b === void 0 ? void 0 : _b.data) || err.message;
        if (status === 429)
            msg = 'Rate limit exceeded – slow down requests';
        res.status(status).json({
            success: false,
            status,
            error: msg
        });
    }
}));
// Get single crypto details with caching
app.get('/api/cryptos/:id/details', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    try {
        const { id } = req.params;
        // Check cache first
        const cachedDetail = yield prisma.cryptoDetailCache.findUnique({
            where: { cryptoId: id }
        });
        if (cachedDetail && isCacheValid(cachedDetail.cachedAt)) {
            console.log(`Serving details for ${id} from cache`);
            const formatted = {
                id: cachedDetail.cryptoId,
                symbol: cachedDetail.symbol,
                name: cachedDetail.name,
                description: cachedDetail.description,
                current_price: cachedDetail.current_price,
                price_change_percentage_24h: cachedDetail.price_change_percentage_24h,
                price_change_percentage_7d: cachedDetail.price_change_percentage_7d,
                price_change_percentage_30d: cachedDetail.price_change_percentage_30d,
                market_cap: cachedDetail.market_cap,
                market_cap_rank: cachedDetail.market_cap_rank,
                volume_24h: cachedDetail.volume_24h,
                circulating_supply: cachedDetail.circulating_supply,
                total_supply: cachedDetail.total_supply,
                max_supply: cachedDetail.max_supply,
                ath: cachedDetail.ath,
                ath_date: cachedDetail.ath_date,
                atl: cachedDetail.atl,
                atl_date: cachedDetail.atl_date,
                image: cachedDetail.image,
                website: cachedDetail.website,
                blockchain_site: cachedDetail.blockchain_site,
                official_forum_url: cachedDetail.official_forum_url,
                repos_url: cachedDetail.repos_url
            };
            return res.json({
                success: true,
                data: formatted,
                cached: true,
                timestamp: cachedDetail.cachedAt.toISOString()
            });
        }
        // Fetch fresh data from API
        console.log(`Fetching fresh details for ${id} from API...`);
        const resp = yield axios_1.default.get(`${COINGECKO_BASE_URL}/coins/${id}`, {
            headers: defaultHeaders,
            params: {
                localization: false,
                tickers: false,
                market_data: true,
                community_data: false,
                developer_data: false,
                sparkline: false
            }
        });
        const data = resp.data;
        const formatted = {
            id: data.id,
            symbol: data.symbol.toUpperCase(),
            name: data.name,
            description: ((_a = data.description) === null || _a === void 0 ? void 0 : _a.en) || 'No description available',
            current_price: data.market_data.current_price.usd,
            price_change_percentage_24h: data.market_data.price_change_percentage_24h,
            price_change_percentage_7d: data.market_data.price_change_percentage_7d,
            price_change_percentage_30d: data.market_data.price_change_percentage_30d,
            market_cap: data.market_data.market_cap.usd,
            market_cap_rank: data.market_cap_rank,
            volume_24h: data.market_data.total_volume.usd,
            circulating_supply: data.market_data.circulating_supply,
            total_supply: data.market_data.total_supply,
            max_supply: data.market_data.max_supply,
            ath: data.market_data.ath.usd,
            ath_date: data.market_data.ath_date.usd,
            atl: data.market_data.atl.usd,
            atl_date: data.market_data.atl_date.usd,
            image: ((_b = data.image) === null || _b === void 0 ? void 0 : _b.large) || ((_c = data.image) === null || _c === void 0 ? void 0 : _c.small),
            website: ((_e = (_d = data.links) === null || _d === void 0 ? void 0 : _d.homepage) === null || _e === void 0 ? void 0 : _e[0]) || '',
            blockchain_site: ((_g = (_f = data.links) === null || _f === void 0 ? void 0 : _f.blockchain_site) === null || _g === void 0 ? void 0 : _g[0]) || '',
            official_forum_url: ((_j = (_h = data.links) === null || _h === void 0 ? void 0 : _h.official_forum_url) === null || _j === void 0 ? void 0 : _j[0]) || '',
            repos_url: ((_m = (_l = (_k = data.links) === null || _k === void 0 ? void 0 : _k.repos_url) === null || _l === void 0 ? void 0 : _l.github) === null || _m === void 0 ? void 0 : _m[0]) || ''
        };
        // Update cache
        yield prisma.cryptoDetailCache.upsert({
            where: { cryptoId: id },
            update: {
                symbol: formatted.symbol,
                name: formatted.name,
                description: formatted.description,
                current_price: formatted.current_price,
                price_change_percentage_24h: formatted.price_change_percentage_24h,
                price_change_percentage_7d: formatted.price_change_percentage_7d,
                price_change_percentage_30d: formatted.price_change_percentage_30d,
                market_cap: formatted.market_cap,
                market_cap_rank: formatted.market_cap_rank,
                volume_24h: formatted.volume_24h,
                circulating_supply: formatted.circulating_supply,
                total_supply: formatted.total_supply,
                max_supply: formatted.max_supply,
                ath: formatted.ath,
                ath_date: formatted.ath_date,
                atl: formatted.atl,
                atl_date: formatted.atl_date,
                image: formatted.image,
                website: formatted.website,
                blockchain_site: formatted.blockchain_site,
                official_forum_url: formatted.official_forum_url,
                repos_url: formatted.repos_url,
                cachedAt: new Date()
            },
            create: {
                cryptoId: id,
                symbol: formatted.symbol,
                name: formatted.name,
                description: formatted.description,
                current_price: formatted.current_price,
                price_change_percentage_24h: formatted.price_change_percentage_24h,
                price_change_percentage_7d: formatted.price_change_percentage_7d,
                price_change_percentage_30d: formatted.price_change_percentage_30d,
                market_cap: formatted.market_cap,
                market_cap_rank: formatted.market_cap_rank,
                volume_24h: formatted.volume_24h,
                circulating_supply: formatted.circulating_supply,
                total_supply: formatted.total_supply,
                max_supply: formatted.max_supply,
                ath: formatted.ath,
                ath_date: formatted.ath_date,
                atl: formatted.atl,
                atl_date: formatted.atl_date,
                image: formatted.image,
                website: formatted.website,
                blockchain_site: formatted.blockchain_site,
                official_forum_url: formatted.official_forum_url,
                repos_url: formatted.repos_url
            }
        });
        res.json({
            success: true,
            data: formatted,
            cached: false,
            timestamp: new Date().toISOString()
        });
    }
    catch (err) {
        const status = ((_o = err.response) === null || _o === void 0 ? void 0 : _o.status) || 500;
        let msg = 'Failed to fetch crypto details';
        if (status === 429)
            msg = 'Rate limit exceeded – too many requests';
        else if (status === 401)
            msg = 'Authentication failed – check your API key';
        res.status(status).json({
            success: false,
            status,
            error: msg,
            details: ((_p = err.response) === null || _p === void 0 ? void 0 : _p.data) || err.message
        });
    }
}));
// Get crypto price history with caching
app.get('/api/cryptos/:id/history', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { id } = req.params;
        const days = req.query.days || '365';
        // Check cache first
        const cachedHistory = yield prisma.priceHistoryCache.findUnique({
            where: {
                cryptoId_days: {
                    cryptoId: id,
                    days: days
                }
            }
        });
        if (cachedHistory && isCacheValid(cachedHistory.cachedAt)) {
            console.log(`Serving price history for ${id} (${days} days) from cache`);
            const data = JSON.parse(cachedHistory.data);
            return res.json({
                success: true,
                data,
                cached: true,
                timestamp: cachedHistory.cachedAt.toISOString()
            });
        }
        // Fetch fresh data from API
        console.log(`Fetching fresh price history for ${id} (${days} days) from API...`);
        const resp = yield axios_1.default.get(`${COINGECKO_BASE_URL}/coins/${id}/market_chart`, {
            headers: defaultHeaders,
            params: {
                vs_currency: 'usd',
                days,
                interval: days === '1' ? 'hourly' : 'daily'
            }
        });
        const prices = resp.data.prices;
        const formatted = prices.map(([timestamp, price]) => ({
            date: new Date(timestamp).toISOString(),
            price
        }));
        // Update cache
        yield prisma.priceHistoryCache.upsert({
            where: {
                cryptoId_days: {
                    cryptoId: id,
                    days: days
                }
            },
            update: {
                data: JSON.stringify(formatted),
                cachedAt: new Date()
            },
            create: {
                cryptoId: id,
                days: days,
                data: JSON.stringify(formatted)
            }
        });
        res.json({
            success: true,
            data: formatted,
            cached: false,
            timestamp: new Date().toISOString()
        });
    }
    catch (err) {
        const status = ((_a = err.response) === null || _a === void 0 ? void 0 : _a.status) || 500;
        let msg = 'Failed to fetch price history';
        if (status === 429)
            msg = 'Rate limit exceeded – too many requests';
        else if (status === 401)
            msg = 'Authentication failed – check your API key';
        res.status(status).json({
            success: false,
            status,
            error: msg,
            details: ((_b = err.response) === null || _b === void 0 ? void 0 : _b.data) || err.message
        });
    }
}));
// Search CoinGecko API directly by name or symbol
app.get('/api/search/:query', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { query } = req.params;
        console.log(`Searching CoinGecko API for: ${query}`);
        // First try to search by name/symbol using the search endpoint
        const searchResp = yield axios_1.default.get(`${COINGECKO_BASE_URL}/search`, {
            headers: defaultHeaders,
            params: {
                query: query
            }
        });
        const searchResults = searchResp.data.coins || [];
        if (searchResults.length === 0) {
            return res.json({
                success: true,
                data: [],
                message: `No cryptocurrencies found matching "${query}"`
            });
        }
        // Get detailed market data for the found coins (up to 10 results)
        const coinIds = searchResults.slice(0, 10).map((coin) => coin.id).join(',');
        const marketResp = yield axios_1.default.get(`${COINGECKO_BASE_URL}/coins/markets`, {
            headers: defaultHeaders,
            params: {
                vs_currency: 'usd',
                ids: coinIds,
                order: 'market_cap_desc',
                per_page: 10,
                page: 1,
                sparkline: false,
                locale: 'en'
            }
        });
        const marketData = marketResp.data;
        const formattedData = marketData.map((c) => ({
            id: c.id,
            symbol: c.symbol.toUpperCase(),
            name: c.name,
            current_price: c.current_price,
            price_change_percentage_24h: c.price_change_percentage_24h,
            market_cap: c.market_cap,
            volume_24h: c.total_volume,
            image: c.image,
            market_cap_rank: c.market_cap_rank
        }));
        res.json({
            success: true,
            data: formattedData,
            query: query,
            found_count: formattedData.length,
            timestamp: new Date().toISOString()
        });
    }
    catch (err) {
        const status = ((_a = err.response) === null || _a === void 0 ? void 0 : _a.status) || 500;
        let msg = 'Failed to search cryptocurrencies';
        if (status === 429)
            msg = 'Rate limit exceeded – too many requests';
        else if (status === 401)
            msg = 'Authentication failed – check your API key';
        res.status(status).json({
            success: false,
            status,
            error: msg,
            details: ((_b = err.response) === null || _b === void 0 ? void 0 : _b.data) || err.message
        });
    }
}));
app.listen(PORT, () => {
    console.log(`🚀 Crypto API server running on port ${PORT}`);
});
