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
exports.dbService = exports.DatabaseService = void 0;
const client_1 = require("@prisma/client");
const formatters_1 = require("../utils/formatters");
const cache_1 = require("../utils/cache");
/**
 * Database service for managing cryptocurrency cache
 */
class DatabaseService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    /**
     * Get cached crypto list
     */
    getCachedCryptoList() {
        return __awaiter(this, void 0, void 0, function* () {
            const cachedData = yield this.prisma.cryptoListCache.findMany({
                orderBy: { market_cap_rank: 'asc' }
            });
            if (cachedData.length === 0) {
                return { data: [], isValid: false };
            }
            // Check if the newest entry is still valid
            const newestCache = cachedData.reduce((newest, current) => current.cachedAt > newest.cachedAt ? current : newest);
            const isValid = (0, cache_1.isCacheValid)(newestCache.cachedAt);
            const formattedData = cachedData.map(formatters_1.formatCachedCryptoData);
            return {
                data: formattedData,
                isValid,
                timestamp: newestCache.cachedAt.toISOString()
            };
        });
    }
    /**
     * Update crypto list cache
     */
    updateCryptoListCache(cryptos) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            // Use upsert to prevent unique constraint violations
            const upsertPromises = cryptos.map(crypto => this.prisma.cryptoListCache.upsert({
                where: { cryptoId: crypto.id },
                update: {
                    symbol: crypto.symbol,
                    name: crypto.name,
                    current_price: crypto.current_price,
                    price_change_percentage_24h: crypto.price_change_percentage_24h,
                    market_cap: crypto.market_cap,
                    volume_24h: crypto.volume_24h,
                    image: crypto.image,
                    market_cap_rank: crypto.market_cap_rank,
                    cachedAt: now
                },
                create: {
                    cryptoId: crypto.id,
                    symbol: crypto.symbol,
                    name: crypto.name,
                    current_price: crypto.current_price,
                    price_change_percentage_24h: crypto.price_change_percentage_24h,
                    market_cap: crypto.market_cap,
                    volume_24h: crypto.volume_24h,
                    image: crypto.image,
                    market_cap_rank: crypto.market_cap_rank,
                    cachedAt: now
                }
            }));
            yield Promise.all(upsertPromises);
        });
    }
    /**
     * Get cached crypto detail
     */
    getCachedCryptoDetail(cryptoId) {
        return __awaiter(this, void 0, void 0, function* () {
            const cached = yield this.prisma.cryptoDetailCache.findUnique({
                where: { cryptoId }
            });
            if (!cached) {
                return { data: null, isValid: false };
            }
            const isValid = (0, cache_1.isCacheValid)(cached.cachedAt);
            if (!isValid) {
                return { data: null, isValid: false };
            }
            return {
                data: {
                    id: cached.cryptoId,
                    symbol: cached.symbol,
                    name: cached.name,
                    description: cached.description || '',
                    current_price: cached.current_price,
                    price_change_percentage_24h: cached.price_change_percentage_24h,
                    price_change_percentage_7d: cached.price_change_percentage_7d,
                    price_change_percentage_30d: cached.price_change_percentage_30d,
                    market_cap: cached.market_cap,
                    market_cap_rank: cached.market_cap_rank,
                    volume_24h: cached.volume_24h,
                    circulating_supply: cached.circulating_supply,
                    total_supply: cached.total_supply,
                    max_supply: cached.max_supply,
                    ath: cached.ath,
                    ath_date: cached.ath_date,
                    atl: cached.atl,
                    atl_date: cached.atl_date,
                    image: cached.image,
                    website: cached.website || '',
                    blockchain_site: cached.blockchain_site || '',
                    official_forum_url: cached.official_forum_url || '',
                    repos_url: cached.repos_url || ''
                },
                isValid: true
            };
        });
    }
    /**
     * Update crypto detail cache
     */
    updateCryptoDetailCache(detail) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.cryptoDetailCache.upsert({
                where: { cryptoId: detail.id },
                update: {
                    symbol: detail.symbol,
                    name: detail.name,
                    description: detail.description,
                    current_price: detail.current_price,
                    price_change_percentage_24h: detail.price_change_percentage_24h,
                    price_change_percentage_7d: detail.price_change_percentage_7d,
                    price_change_percentage_30d: detail.price_change_percentage_30d,
                    market_cap: detail.market_cap,
                    market_cap_rank: detail.market_cap_rank,
                    volume_24h: detail.volume_24h,
                    circulating_supply: detail.circulating_supply,
                    total_supply: detail.total_supply,
                    max_supply: detail.max_supply,
                    ath: detail.ath,
                    ath_date: detail.ath_date,
                    atl: detail.atl,
                    atl_date: detail.atl_date,
                    image: detail.image,
                    website: detail.website,
                    blockchain_site: detail.blockchain_site,
                    official_forum_url: detail.official_forum_url,
                    repos_url: detail.repos_url,
                    cachedAt: new Date()
                },
                create: {
                    cryptoId: detail.id,
                    symbol: detail.symbol,
                    name: detail.name,
                    description: detail.description,
                    current_price: detail.current_price,
                    price_change_percentage_24h: detail.price_change_percentage_24h,
                    price_change_percentage_7d: detail.price_change_percentage_7d,
                    price_change_percentage_30d: detail.price_change_percentage_30d,
                    market_cap: detail.market_cap,
                    market_cap_rank: detail.market_cap_rank,
                    volume_24h: detail.volume_24h,
                    circulating_supply: detail.circulating_supply,
                    total_supply: detail.total_supply,
                    max_supply: detail.max_supply,
                    ath: detail.ath,
                    ath_date: detail.ath_date,
                    atl: detail.atl,
                    atl_date: detail.atl_date,
                    image: detail.image,
                    website: detail.website,
                    blockchain_site: detail.blockchain_site,
                    official_forum_url: detail.official_forum_url,
                    repos_url: detail.repos_url,
                    cachedAt: new Date()
                }
            });
        });
    }
    /**
     * Get cached price history
     */
    getCachedPriceHistory(cryptoId_1) {
        return __awaiter(this, arguments, void 0, function* (cryptoId, days = '365') {
            const cached = yield this.prisma.priceHistoryCache.findUnique({
                where: {
                    cryptoId_days: {
                        cryptoId,
                        days
                    }
                }
            });
            if (!cached) {
                return { data: null, isValid: false };
            }
            const isValid = (0, cache_1.isCacheValid)(cached.cachedAt);
            if (!isValid) {
                return { data: null, isValid: false };
            }
            return {
                data: JSON.parse(cached.data),
                isValid: true
            };
        });
    }
    /**
     * Update price history cache
     */
    updatePriceHistoryCache(cryptoId_1, chartData_1) {
        return __awaiter(this, arguments, void 0, function* (cryptoId, chartData, days = '365') {
            yield this.prisma.priceHistoryCache.upsert({
                where: {
                    cryptoId_days: {
                        cryptoId,
                        days
                    }
                },
                update: {
                    data: JSON.stringify(chartData),
                    cachedAt: new Date()
                },
                create: {
                    cryptoId,
                    days,
                    data: JSON.stringify(chartData),
                    cachedAt: new Date()
                }
            });
        });
    }
    /**
     * Close database connection
     */
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.$disconnect();
        });
    }
}
exports.DatabaseService = DatabaseService;
exports.dbService = new DatabaseService();
