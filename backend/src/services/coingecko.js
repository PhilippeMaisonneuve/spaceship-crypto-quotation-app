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
exports.coinGeckoService = exports.CoinGeckoService = void 0;
const axios_1 = __importDefault(require("axios"));
const environment_1 = require("../config/environment");
const formatters_1 = require("../utils/formatters");
/**
 * CoinGecko API service for fetching cryptocurrency data
 */
class CoinGeckoService {
    constructor() {
        this.baseUrl = environment_1.config.coinGeckoBaseUrl;
        this.headers = {
            'x-cg-demo-api-key': environment_1.config.coinGeckoApiKey
        };
    }
    /**
     * Test API connectivity
     */
    testConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            const ping = yield axios_1.default.get(`${this.baseUrl}/ping`, { headers: this.headers });
            const markets = yield axios_1.default.get(`${this.baseUrl}/coins/markets`, {
                headers: this.headers,
                params: {
                    vs_currency: 'usd',
                    per_page: 250,
                    page: 1,
                    sparkline: false,
                    locale: 'en'
                }
            });
            return {
                ping: ping.data,
                markets_count: markets.data.length
            };
        });
    }
    /**
     * Fetch top 1000 cryptocurrencies (4 pages of 250 each)
     */
    fetchTopCryptos() {
        return __awaiter(this, void 0, void 0, function* () {
            const allCryptos = [];
            const pages = [1, 2, 3, 4]; // 4 pages × 250 = 1000 cryptos
            const pagePromises = pages.map((page) => __awaiter(this, void 0, void 0, function* () {
                const response = yield axios_1.default.get(`${this.baseUrl}/coins/markets`, {
                    headers: this.headers,
                    params: {
                        vs_currency: 'usd',
                        per_page: 250,
                        page,
                        sparkline: false,
                        locale: 'en'
                    }
                });
                return response.data.map(formatters_1.formatCryptoData);
            }));
            const pageResults = yield Promise.all(pagePromises);
            pageResults.forEach(pageData => allCryptos.push(...pageData));
            return allCryptos;
        });
    }
    /**
     * Fetch detailed information for a specific cryptocurrency
     */
    fetchCryptoDetail(cryptoId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseUrl}/coins/${cryptoId}`, {
                headers: this.headers,
                params: {
                    localization: false,
                    tickers: false,
                    market_data: true,
                    community_data: false,
                    developer_data: false,
                    sparkline: false
                }
            });
            return (0, formatters_1.formatCryptoDetail)(response.data);
        });
    }
    /**
     * Fetch price history for a cryptocurrency
     */
    fetchPriceHistory(cryptoId_1) {
        return __awaiter(this, arguments, void 0, function* (cryptoId, days = 365) {
            const response = yield axios_1.default.get(`${this.baseUrl}/coins/${cryptoId}/market_chart`, {
                headers: this.headers,
                params: {
                    vs_currency: 'usd',
                    days,
                    interval: days <= 30 ? 'hourly' : 'daily'
                }
            });
            return (0, formatters_1.formatChartData)(response.data.prices);
        });
    }
    /**
     * Search cryptocurrencies by query
     */
    searchCryptos(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseUrl}/search`, {
                headers: this.headers,
                params: { query }
            });
            return response.data.coins || [];
        });
    }
    /**
     * Handle API errors with specific error messages
     */
    static handleApiError(error) {
        var _a, _b, _c;
        const status = ((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) || 500;
        let message = 'Failed to fetch data from CoinGecko API';
        switch (status) {
            case 429:
                message = 'Rate limit exceeded – too many requests. Please try again in a few minutes.';
                break;
            case 401:
                message = 'Authentication failed – check your CoinGecko API key';
                break;
            case 404:
                message = 'Cryptocurrency not found';
                break;
            case 500:
            case 502:
            case 503:
                message = 'CoinGecko API is temporarily unavailable';
                break;
            default:
                message = `API error: ${((_b = error.response) === null || _b === void 0 ? void 0 : _b.statusText) || error.message}`;
        }
        return {
            status,
            message,
            details: ((_c = error.response) === null || _c === void 0 ? void 0 : _c.data) || error.message
        };
    }
}
exports.CoinGeckoService = CoinGeckoService;
exports.coinGeckoService = new CoinGeckoService();
