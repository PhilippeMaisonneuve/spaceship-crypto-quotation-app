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
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchCryptos = exports.getCryptoHistory = exports.getCryptoDetail = exports.getCryptos = exports.getAllCryptos = void 0;
const coingecko_1 = require("../services/coingecko");
const database_1 = require("../services/database");
const cache_1 = require("../utils/cache");
const errorHandler_1 = require("../middleware/errorHandler");
/**
 * Cryptocurrency data controllers
 */
/**
 * Get all cryptocurrencies with caching
 */
exports.getAllCryptos = (0, errorHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const forceRefresh = req.query.refresh;
    // Check cached data first (unless force refresh is requested)
    if (!forceRefresh) {
        const cached = yield database_1.dbService.getCachedCryptoList();
        if (cached.data.length > 0 && cached.isValid) {
            console.log(`Serving ${cached.data.length} cryptocurrencies from cache`);
            return res.json({
                success: true,
                total_count: cached.data.length,
                data: cached.data,
                cached: true,
                timestamp: cached.timestamp
            });
        }
    }
    const refreshReason = forceRefresh ? 'Force refresh requested' : 'Cache expired or missing';
    // Check if cache is already being updated
    if (cache_1.cacheManager.isCacheUpdating) {
        console.log('Cache update already in progress, serving existing cache...');
        const cached = yield database_1.dbService.getCachedCryptoList();
        if (cached.data.length > 0) {
            return res.json({
                success: true,
                total_count: cached.data.length,
                data: cached.data,
                cached: true,
                stale: true,
                message: 'Serving cached data while refreshing in background',
                timestamp: cached.timestamp
            });
        }
    }
    // Fetch fresh data with cache lock
    console.log(`Fetching fresh crypto data: ${refreshReason}`);
    try {
        const freshData = yield cache_1.cacheManager.withLock(() => __awaiter(void 0, void 0, void 0, function* () {
            const cryptos = yield coingecko_1.coinGeckoService.fetchTopCryptos();
            yield database_1.dbService.updateCryptoListCache(cryptos);
            return cryptos;
        }));
        console.log(`Successfully fetched and cached ${freshData.length} cryptocurrencies`);
        res.json({
            success: true,
            total_count: freshData.length,
            data: freshData,
            cached: false,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        // If API fails, try to serve stale cached data as fallback
        console.log('API call failed, attempting to serve stale cached data...');
        const cached = yield database_1.dbService.getCachedCryptoList();
        if (cached.data.length > 0) {
            console.log(`Serving ${cached.data.length} stale cached cryptocurrencies as fallback`);
            return res.json({
                success: true,
                total_count: cached.data.length,
                data: cached.data,
                cached: true,
                stale: true,
                warning: 'API temporarily unavailable, serving cached data',
                timestamp: cached.timestamp
            });
        }
        // No cache available, throw the original error
        throw error;
    }
}));
/**
 * Get cryptocurrencies (legacy endpoint for compatibility)
 */
exports.getCryptos = exports.getAllCryptos;
/**
 * Get detailed information for a specific cryptocurrency
 */
exports.getCryptoDetail = (0, errorHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // Check cache first
    const cached = yield database_1.dbService.getCachedCryptoDetail(id);
    if (cached.data && cached.isValid) {
        console.log(`Serving crypto detail for ${id} from cache`);
        return res.json({
            success: true,
            data: cached.data,
            cached: true
        });
    }
    console.log(`Fetching fresh crypto detail for ${id}`);
    try {
        const detail = yield coingecko_1.coinGeckoService.fetchCryptoDetail(id);
        yield database_1.dbService.updateCryptoDetailCache(detail);
        res.json({
            success: true,
            data: detail,
            cached: false
        });
    }
    catch (error) {
        // If we have stale cache, serve it as fallback
        if (cached.data) {
            console.log(`API failed, serving stale cached detail for ${id}`);
            return res.json({
                success: true,
                data: cached.data,
                cached: true,
                stale: true,
                warning: 'API temporarily unavailable, serving cached data'
            });
        }
        throw error;
    }
}));
/**
 * Get price history for a cryptocurrency
 */
exports.getCryptoHistory = (0, errorHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const days = parseInt(req.query.days) || 365;
    // Check cache first
    const cached = yield database_1.dbService.getCachedPriceHistory(id, days.toString());
    if (cached.data && cached.isValid) {
        console.log(`Serving price history for ${id} from cache`);
        return res.json({
            success: true,
            data: cached.data,
            cached: true
        });
    }
    console.log(`Fetching fresh price history for ${id}`);
    try {
        const history = yield coingecko_1.coinGeckoService.fetchPriceHistory(id, days);
        yield database_1.dbService.updatePriceHistoryCache(id, history, days.toString());
        res.json({
            success: true,
            data: history,
            cached: false
        });
    }
    catch (error) {
        // If we have stale cache, serve it as fallback
        if (cached.data) {
            console.log(`API failed, serving stale cached history for ${id}`);
            return res.json({
                success: true,
                data: cached.data,
                cached: true,
                stale: true,
                warning: 'API temporarily unavailable, serving cached data'
            });
        }
        throw error;
    }
}));
/**
 * Search cryptocurrencies
 */
exports.searchCryptos = (0, errorHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req.params;
    if (!query || query.trim().length === 0) {
        return res.status(400).json({
            success: false,
            error: 'Search query is required',
            status: 400
        });
    }
    console.log(`Searching for cryptocurrencies with query: "${query}"`);
    const searchResults = yield coingecko_1.coinGeckoService.searchCryptos(query);
    // Format the results to match our API response format
    const formattedData = searchResults.slice(0, 50).map((coin) => ({
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        market_cap_rank: coin.market_cap_rank || 999999,
        image: coin.large || coin.thumb || ''
    }));
    res.json({
        success: true,
        data: formattedData,
        query: query,
        found_count: formattedData.length,
        timestamp: new Date().toISOString()
    });
}));
